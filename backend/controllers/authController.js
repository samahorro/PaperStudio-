const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendLoginOtpEmail, sendPasswordResetEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'paperstudio_fallback_secret_123';

// ─── Registration & Verification ────────────────────────

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate a 6-digit email verification code
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      emailVerificationCode
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerificationCode);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr.message);
    }

    res.status(201).json({
      message: "User registered. Please check your email for the verification code.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyRegistrationCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) return res.status(400).json({ message: "Email and code required" });

    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Email is already verified" });
    if (user.emailVerificationCode !== code) return res.status(400).json({ message: "Invalid verification code" });

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Login ─────────────────────────────────────────────

const loginUser = async (req, res) => {
  try {
    const { email, password, mfaCode } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Admin accounts skip email verification and MFA
    if (user.role !== 'admin' && !user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    // Admin accounts bypass MFA — log in directly
    if (user.role === 'admin') {
      // Skip MFA, go straight to token
    } else if (!mfaCode) {
      // Email-based MFA for regular users: generate and email an OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.loginOtpCode = otpCode;
      user.loginOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      try {
        await sendLoginOtpEmail(email, otpCode);
      } catch (emailErr) {
        console.error('Failed to send login OTP email:', emailErr.message);
      }

      return res.status(403).json({
        message: "A verification code has been sent to your email.",
        requiresMfa: true
      });
    } else {
      // Verify the email OTP
      if (!user.loginOtpCode || user.loginOtpCode !== mfaCode) {
        return res.status(401).json({ message: "Invalid verification code" });
      }
      if (!user.loginOtpExpires || new Date() > user.loginOtpExpires) {
        return res.status(401).json({ message: "Verification code has expired. Please log in again." });
      }

      // Clear OTP after successful use
      user.loginOtpCode = null;
      user.loginOtpExpires = null;
      await user.save();
    }

    // Login fully authenticated!
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Profile ───────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'mfaSecret', 'emailVerificationCode', 'passwordResetCode', 'passwordResetExpires'] }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedFields = ['name', 'phone', 'address', 'city', 'state', 'zipCode'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Password Reset ────────────────────────────────────

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal whether the email exists for security
      return res.json({ message: "If an account with that email exists, a reset code has been sent." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = resetCode;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Send reset code via email
    try {
      await sendPasswordResetEmail(email, resetCode);
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr.message);
    }

    res.json({
      message: "If an account with that email exists, a reset code has been sent."
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Email, code, and new password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.passwordResetCode !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── MFA Setup ─────────────────────────────────────────

const enableMFA = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.mfaEnabled) {
      return res.status(400).json({ message: "MFA is already enabled" });
    }

    const secret = speakeasy.generateSecret({ 
      name: `PaperStudio (${user.email})` 
    });

    user.mfaSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ message: "Error generating QR code" });
      res.json({
        message: "Scan this QR code with Google Authenticator, then call /verify with the code to activate.",
        secret: secret.base32,
        qrCodeUrl: data_url
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyMFA = async (req, res) => {
  try {
    const { mfaCode } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.mfaSecret) return res.status(400).json({ message: "MFA has not been initialized" });
    if (user.mfaEnabled) return res.status(400).json({ message: "MFA is already activated" });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaCode,
      window: 1
    });

    if (verified) {
      user.mfaEnabled = true;
      await user.save();
      return res.json({ message: "MFA successfully activated! You will now need codes to login." });
    } else {
      return res.status(400).json({ message: "Invalid MFA code. Try again." });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  verifyRegistrationCode,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  enableMFA,
  verifyMFA
};
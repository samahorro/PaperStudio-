const Coupon = require('../models/Coupon');

// ─── Validate Coupon Code ──────────────────────────────

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ where: { code, isActive: true } });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    // Check expiration
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Check usage limit
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon has reached its usage limit" });
    }

    res.json({
      message: "Coupon is valid",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error validating coupon", error: error.message });
  }
};

// ─── Create Coupon (Admin) ─────────────────────────────

const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body;

    // Check for duplicate code
    const existing = await Coupon.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || null,
      expiresAt: expiresAt || null,
      isActive: true
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Error creating coupon", error: error.message });
  }
};

// ─── Get All Coupons (Admin) ───────────────────────────

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error: error.message });
  }
};

module.exports = {
  validateCoupon,
  createCoupon,
  getAllCoupons
};

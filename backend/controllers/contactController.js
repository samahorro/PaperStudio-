const ContactMessage = require('../models/ContactMessage');

// ─── Submit Contact Form ───────────────────────────────

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await ContactMessage.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    res.status(201).json({
      message: "Thank you for your message! We'll get back to you soon.",
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting contact form", error: error.message });
  }
};

// ─── Get All Messages (Admin) ──────────────────────────

const getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const messages = await ContactMessage.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// ─── Update Message Status (Admin) ─────────────────────

const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    msg.status = status;
    await msg.save();

    res.json({ message: "Status updated", contact: msg });
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error: error.message });
  }
};

module.exports = {
  submitContact,
  getAllMessages,
  updateMessageStatus
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, OrderItem, Product } = require('../models');

// ─── Create Stripe Checkout Session ────────────────────

const createStripeSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key_here') {
      return res.status(500).json({ message: "Stripe is not configured. Please add your STRIPE_SECRET_KEY to .env" });
    }

    // Find the order
    const order = await Order.findOne({
      where: { id: orderId, userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'imageUrl'] }]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: "Order has already been processed" });
    }

    // Build Stripe line items from order items
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.Product.name,
          ...(item.Product.imageUrl ? { images: [item.Product.imageUrl] } : {})
        },
        unit_amount: Math.round(parseFloat(item.unitPrice) * 100), // Stripe uses cents
      },
      quantity: item.quantity
    }));

    // Add shipping as a line item if applicable
    if (parseFloat(order.shipping) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(parseFloat(order.shipping) * 100),
        },
        quantity: 1
      });
    }

    // Add tax as a line item
    if (parseFloat(order.tax) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax' },
          unit_amount: Math.round(parseFloat(order.tax) * 100),
        },
        quantity: 1
      });
    }

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/orders/${order.id}?payment=success`,
      cancel_url: `${FRONTEND_URL}/orders/${order.id}?payment=cancelled`,
      metadata: {
        orderId: order.id,
        userId: req.user.id
      }
    });

    // Save session ID to order
    order.stripeSessionId = session.id;
    await order.save();

    res.json({
      message: "Stripe checkout session created",
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating payment session", error: error.message });
  }
};

// ─── Stripe Webhook ────────────────────────────────────

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // For development without webhook signing
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await Order.findByPk(orderId);
        if (order && order.status === 'pending') {
          order.status = 'paid';
          await order.save();
          console.log(`✅ Order ${orderId} marked as paid via Stripe webhook`);
        }
      } catch (err) {
        console.error('Error updating order from webhook:', err.message);
      }
    }
  }

  res.json({ received: true });
};

module.exports = {
  createStripeSession,
  handleWebhook
};

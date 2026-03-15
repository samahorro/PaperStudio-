const { Order, OrderItem, CartItem, Product, Coupon } = require('../models');
const sequelize = require('../config/db');

// ─── Checkout / Create Order ───────────────────────────

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const {
      shippingAddress,
      phone,
      paymentMethod,
      couponCode,
      isGift,
      scheduledDelivery
    } = req.body;

    // 1. Get user's cart with product details
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }],
      transaction
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Validate stock for all items
    for (const item of cartItems) {
      if (!item.Product.inStock || item.Product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `"${item.Product.name}" is out of stock or has insufficient quantity`
        });
      }
    }

    // 3. Calculate subtotal
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += parseFloat(item.Product.price) * item.quantity;
    }

    // 4. Apply coupon discount if provided
    let discount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: { code: couponCode, isActive: true },
        transaction
      });

      if (coupon) {
        // Check expiration
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
          await transaction.rollback();
          return res.status(400).json({ message: "Coupon has expired" });
        }

        // Check usage limit
        if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
          await transaction.rollback();
          return res.status(400).json({ message: "Coupon has reached its usage limit" });
        }

        // Check minimum order
        if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`
          });
        }

        // Calculate discount
        if (coupon.discountType === 'percent') {
          discount = subtotal * (parseFloat(coupon.discountValue) / 100);
        } else {
          discount = parseFloat(coupon.discountValue);
        }

        // Ensure discount doesn't exceed subtotal
        discount = Math.min(discount, subtotal);
        appliedCouponCode = coupon.code;

        // Increment coupon usage
        coupon.currentUses += 1;
        await coupon.save({ transaction });
      }
    }

    // 5. Calculate shipping & tax
    const discountedSubtotal = subtotal - discount;
    const shipping = discountedSubtotal >= 50 ? 0 : 5.99; // Free shipping over $50
    const taxRate = 0.08; // 8% tax
    const tax = parseFloat((discountedSubtotal * taxRate).toFixed(2));
    const total = parseFloat((discountedSubtotal + shipping + tax).toFixed(2));

    // 6. Create order
    const order = await Order.create({
      userId,
      status: 'pending',
      subtotal,
      shipping,
      tax,
      total,
      discount,
      couponCode: appliedCouponCode,
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || 'card',
      isGift: isGift || false,
      scheduledDelivery: scheduledDelivery || null
    }, { transaction });

    // 7. Create order items and reduce stock
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.Product.price,
        color: item.color
      }, { transaction });

      // Reduce product stock
      item.Product.stock -= item.quantity;
      await item.Product.save({ transaction });
    }

    // 8. Clear the user's cart
    await CartItem.destroy({ where: { userId }, transaction });

    await transaction.commit();

    // Reload order with items
    const fullOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'imageUrl'] }]
      }]
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: fullOrder
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// ─── Get User's Orders ─────────────────────────────────

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'imageUrl'] }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ─── Get Order By ID ───────────────────────────────────

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, attributes: ['id', 'name', 'imageUrl', 'price'] }]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// ─── Update Order Status (Admin) ───────────────────────

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If cancelling, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const orderItems = await OrderItem.findAll({ where: { orderId: order.id } });
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to "${status}"`, order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};

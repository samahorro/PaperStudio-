const { CartItem, Product } = require('../models');

// ─── Get Cart ──────────────────────────────────────────

const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'imageUrl', 'color', 'stock', 'inStock']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate cart summary
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += parseFloat(item.Product.price) * item.quantity;
    }

    res.json({
      items: cartItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

// ─── Add to Cart ───────────────────────────────────────

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, color } = req.body;

    // Verify product exists and is in stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.inStock) {
      return res.status(400).json({ message: "Product is out of stock" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId,
        ...(color ? { color } : {})
      }
    });

    if (existingItem) {
      // Increment quantity
      existingItem.quantity += quantity || 1;
      if (existingItem.quantity > product.stock) {
        return res.status(400).json({ message: `Cannot add more than ${product.stock} items` });
      }
      await existingItem.save();
      
      // Reload with product data
      await existingItem.reload({ include: [{ model: Product }] });
      return res.json({ message: "Cart updated", item: existingItem });
    }

    // Create new cart item
    const cartItem = await CartItem.create({
      userId: req.user.id,
      productId,
      quantity: quantity || 1,
      color: color || null
    });

    // Reload with product data
    await cartItem.reload({ include: [{ model: Product }] });
    res.status(201).json({ message: "Item added to cart", item: cartItem });

  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// ─── Update Cart Item ──────────────────────────────────

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Product }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity > cartItem.Product.stock) {
      return res.status(400).json({ message: `Only ${cartItem.Product.stock} items available` });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: "Cart item updated", item: cartItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error: error.message });
  }
};

// ─── Remove Cart Item ──────────────────────────────────

const removeCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing cart item", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};
# PaperStudio — Frontend Integration Guide

> **For the frontend team.** This document covers everything you need to connect to the PaperStudio backend API running on **AWS Elastic Beanstalk**, including the base URL, authentication flow, every endpoint with request/response examples, and error handling.

---
EB Enviornment url: http://paperstudio-env.eba-zhfvtb4v.us-east-1.elasticbeanstalk.com/
## 1. Connecting to the API

### Base URL

The backend is deployed on AWS Elastic Beanstalk. All API requests should be made to:

```
http://paperstudio-env.eba-zhfvtb4v.us-east-1.elasticbeanstalk.com/api
```

Set this as a constant in your `api.js`:

```js
const BASE_URL = 'http://<your-eb-environment-url>/api';
```

> **Note:** The backend serves the built frontend as static files from `/public`. When the frontend is bundled and deployed alongside the backend, you can use relative paths (`/api/...`) instead of the full EB URL.

### Seeded Test Data

The database is pre-seeded with:
- **Admin account**: `admin@paperstudio.com` / `Admin123!`
- **13 products** across all 6 categories
- **2 coupons**: `WELCOME10` (10% off, min $20) and `SAVE5` ($5 off, min $30)

---

## 2. Authentication Flow

### How Auth Works

1. **Register** → user gets a 6-digit verification code (returned in the response as `mockEmailCode`)
2. **Verify Email** → user submits the code to activate their account
3. **Login** → returns a JWT token (valid 24 hrs)
4. **Store the token** in `localStorage` or React context
5. **Send the token** on every protected request via the `Authorization` header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### MFA (Optional)

If a user enables MFA:
1. Call `POST /api/auth/mfa/enable` → returns a QR code data URL
2. User scans it with Google Authenticator
3. Call `POST /api/auth/mfa/verify` with the 6-digit TOTP code to activate
4. On future logins, user must include `mfaCode` in the login request body

### Password Reset Flow

1. `POST /api/auth/forgot-password` with `{ email }` → returns a reset code as `mockResetCode`
2. `POST /api/auth/reset-password` with `{ email, code, newPassword }`

---

## 3. API Reference — Request / Response Examples

> 🔒 = Requires `Authorization: Bearer <token>` header
> 🔑 = Requires admin role
> All request bodies are JSON unless noted otherwise.

---

### AUTH

#### `POST /api/auth/register`
```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "password": "MyPass123" }

// Response 201
{
  "message": "User registered. Please verify your email with the provided code.",
  "mockEmailCode": "483921",
  "user": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com", "role": "customer" }
}
```

#### `POST /api/auth/verify-registration`
```json
// Request
{ "email": "jane@example.com", "code": "483921" }

// Response 200
{ "message": "Email verified successfully! You can now log in." }
```

#### `POST /api/auth/login`
```json
// Request (without MFA)
{ "email": "jane@example.com", "password": "MyPass123" }

// Request (with MFA)
{ "email": "jane@example.com", "password": "MyPass123", "mfaCode": "123456" }

// Response 200
{
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com", "role": "customer" }
}

// Response 403 (MFA required)
{ "message": "MFA Code is required to complete login", "requiresMfa": true }
```

#### `POST /api/auth/forgot-password`
```json
// Request
{ "email": "jane@example.com" }

// Response 200
{ "message": "If an account with that email exists, a reset code has been sent.", "mockResetCode": "592017" }
```

#### `POST /api/auth/reset-password`
```json
// Request
{ "email": "jane@example.com", "code": "592017", "newPassword": "NewPass456" }

// Response 200
{ "message": "Password reset successfully. You can now log in with your new password." }
```

#### 🔒 `GET /api/auth/profile`
```json
// Response 200
{
  "user": {
    "id": "uuid", "name": "Jane Doe", "email": "jane@example.com",
    "phone": null, "address": null, "city": null, "state": null, "zipCode": null,
    "role": "customer", "isEmailVerified": true, "mfaEnabled": false
  }
}
```

#### 🔒 `PUT /api/auth/profile`
```json
// Request (all fields optional)
{ "name": "Jane Smith", "phone": "555-1234", "address": "123 Main St", "city": "Austin", "state": "TX", "zipCode": "78701" }

// Response 200
{ "message": "Profile updated successfully", "user": { ... } }
```

---

### PRODUCTS

#### `GET /api/products`
Supports query parameters for filtering:

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `category` | string | `notebooks` | Filter by: `notebooks`, `sketchbooks`, `calendars`, `pens`, `pencils`, `cases` |
| `color` | string | `blue` | Partial, case-insensitive match |
| `inStock` | boolean | `true` | Only in-stock or out-of-stock |
| `minPrice` | number | `10` | Minimum price |
| `maxPrice` | number | `30` | Maximum price |
| `search` | string | `spiral` | Searches name + description |

```
GET /api/products?category=notebooks&inStock=true&maxPrice=20
```

```json
// Response 200 — array of products
[
  {
    "id": "uuid",
    "name": "Classic Spiral Notebook",
    "description": "A premium 200-page spiral-bound notebook...",
    "price": "14.99",
    "category": "notebooks",
    "color": "Black",
    "stock": 50,
    "inStock": true,
    "imageUrl": "https://bucket.s3.amazonaws.com/products/abc.jpg",
    "createdAt": "2026-03-15T...",
    "updatedAt": "2026-03-15T..."
  }
]
```

#### `GET /api/products/:id`
```json
// Response 200 — single product object (same shape as above)
// Response 404
{ "message": "Product not found" }
```

#### 🔒🔑 `POST /api/products` — FormData (multipart)
```js
const formData = new FormData();
formData.append('name', 'New Notebook');
formData.append('description', 'A fancy notebook');
formData.append('price', '19.99');
formData.append('category', 'notebooks');
formData.append('color', 'Red');
formData.append('stock', '25');
formData.append('image', fileInput.files[0]); // image file

// DO NOT set Content-Type header — browser sets it with boundary
fetch(`${BASE_URL}/products`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

### CART

#### 🔒 `GET /api/cart`
```json
// Response 200
{
  "items": [
    {
      "id": "cart-item-uuid",
      "userId": "user-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "color": "Black",
      "Product": {
        "id": "product-uuid",
        "name": "Classic Spiral Notebook",
        "price": "14.99",
        "imageUrl": "https://...",
        "color": "Black",
        "stock": 50,
        "inStock": true
      }
    }
  ],
  "subtotal": 29.98,
  "itemCount": 2
}
```

#### 🔒 `POST /api/cart`
```json
// Request
{ "productId": "product-uuid", "quantity": 2, "color": "Black" }

// Response 201 (new item) or 200 (quantity incremented if same product+color exists)
{ "message": "Item added to cart", "item": { ... } }
```

> **Note:** If the same product+color is already in the cart, the backend automatically increments the quantity instead of creating a duplicate.

#### 🔒 `PUT /api/cart/:cartItemId`
```json
// Request
{ "quantity": 3 }

// Response 200
{ "message": "Cart item updated", "item": { ... } }
```

#### 🔒 `DELETE /api/cart/:cartItemId`
```json
// Response 200
{ "message": "Item removed from cart" }
```

---

### COUPONS

#### 🔒 `POST /api/coupons/validate`
Call this before checkout to preview the discount.

```json
// Request
{ "code": "WELCOME10" }

// Response 200
{
  "message": "Coupon is valid",
  "coupon": { "code": "WELCOME10", "discountType": "percent", "discountValue": "10.00", "minOrderAmount": "20.00" }
}

// Response 404
{ "message": "Invalid coupon code" }

// Response 400
{ "message": "Coupon has expired" }
```

---

### CHECKOUT & ORDERS

#### 🔒 `POST /api/orders/checkout`
Creates an order from the user's cart. The backend handles all the math.

```json
// Request
{
  "shippingAddress": "123 Main St, Austin, TX 78701",
  "phone": "555-1234",
  "paymentMethod": "card",          // "card" | "paypal" | "apple_wallet"
  "couponCode": "WELCOME10",        // optional
  "isGift": false,                   // optional
  "scheduledDelivery": "2026-04-01"  // optional ISO date
}

// Response 201
{
  "message": "Order placed successfully",
  "order": {
    "id": "order-uuid",
    "status": "pending",
    "subtotal": "29.98",
    "discount": "3.00",
    "shipping": "0.00",
    "tax": "2.16",
    "total": "29.14",
    "couponCode": "WELCOME10",
    "shippingAddress": "123 Main St, Austin, TX 78701",
    "paymentMethod": "card",
    "isGift": false,
    "items": [
      {
        "id": "item-uuid",
        "productId": "product-uuid",
        "quantity": 2,
        "unitPrice": "14.99",
        "color": "Black",
        "Product": { "id": "...", "name": "Classic Spiral Notebook", "imageUrl": "..." }
      }
    ]
  }
}
```

> **Business Rules:**
> - Shipping is **free** on orders ≥ $50 (otherwise $5.99)
> - Tax is **8%** of the post-discount subtotal
> - Cart is **automatically cleared** after a successful checkout
> - Product stock is **automatically reduced**

#### 🔒 `GET /api/orders`
```json
// Response 200 — array of orders (same shape as above, most recent first)
```

#### 🔒 `GET /api/orders/:orderId`
```json
// Response 200 — single order with items
// Response 404
{ "message": "Order not found" }
```

---

### PAYMENTS (Stripe)

> **Note:** Stripe is configured on the backend via EB environment variables. The frontend just needs to redirect.

#### 🔒 `POST /api/payments/create-session`
Call this **after** checkout to redirect the user to Stripe's hosted payment page.

```json
// Request
{ "orderId": "order-uuid" }

// Response 200
{
  "message": "Stripe checkout session created",
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Frontend usage:**
```js
const data = await createStripeSession(token, orderId);
window.location.href = data.url; // redirect to Stripe
// Stripe redirects back to /orders/:id?payment=success or ?payment=cancelled
```

---

### CONTACT FORM

#### `POST /api/contact`
No authentication required. Rate limited to 5 per hour.

```json
// Request
{ "name": "John Doe", "email": "john@example.com", "subject": "Shipping Question", "message": "How long does shipping take?" }

// Response 201
{ "message": "Thank you for your message! We'll get back to you soon.", "contact": { "id": "uuid", ... } }
```

---

## 4. Error Handling

All errors follow this shape:

```json
{ "message": "Human-readable error description" }
```

### Common Status Codes

| Code | Meaning | When You'll See It |
|------|---------|--------------------|
| `400` | Bad Request | Validation failed, invalid input, out of stock |
| `401` | Unauthorized | Missing/invalid/expired token |
| `403` | Forbidden | Email not verified, MFA required, not an admin |
| `404` | Not Found | Product/order/cart item doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded (auth: 10/15min, contact: 5/hr) |
| `500` | Server Error | Something broke on our end |

### Validation Errors (400)

When input validation fails, you get a structured response:
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one number

---

## 5. Updated `api.js`

Your existing `api.js` is already mostly correct. Here are the **new functions** to add for the features that didn't exist before:

```js
const BASE_URL = 'http://<your-eb-environment-url>/api';
// OR if frontend is deployed with the backend on EB:
// const BASE_URL = '/api';

// ========== AUTH (new endpoints) ==========

export const updateProfile = async (token, profileData) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });
    return response.json();
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
};

export const resetPassword = async (email, code, newPassword) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
    });
    return response.json();
};

// ========== COUPONS ==========

export const validateCoupon = async (token, code) => {
    const response = await fetch(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    });
    return response.json();
};

// ========== PAYMENTS ==========

export const createStripeSession = async (token, orderId) => {
    const response = await fetch(`${BASE_URL}/payments/create-session`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
    });
    return response.json();
};

// ========== CONTACT ==========

export const submitContactForm = async (contactData) => {
    const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });
    return response.json();
};
```

> **Important fix:** In your existing `verifyRegistrationCode` function, change the body from `{ username, code }` to `{ email, code }` — the backend expects `email`, not `username`.

---

## 6. Product Categories & Colors (for filter UI)

Use these values for the Collections page filter sidebar:

**Categories:**
```js
const CATEGORIES = ['notebooks', 'sketchbooks', 'calendars', 'pens', 'pencils', 'cases'];
```

**Sample colors in the database:**
```js
const COLORS = ['Black', 'Navy Blue', 'Brown', 'White', 'Gray', 'Gold', 'Silver',
                'Natural Wood', 'Olive Green', 'Tan', 'Pastel Pink', 'Green', 'Assorted'];
```

**Availability:**
```js
// Pass as query param: ?inStock=true or ?inStock=false
```

---

## 7. Typical Page-to-API Mapping

| Figma Page | API Calls Needed |
|------------|-----------------|
| **Home** | `GET /api/products` (featured sections by category) |
| **Collections** | `GET /api/products?category=X&color=Y&inStock=Z` |
| **Product Detail** | `GET /api/products/:id`, `POST /api/cart` |
| **Cart** | `GET /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`, `POST /api/coupons/validate` |
| **Checkout** | `POST /api/orders/checkout`, `POST /api/payments/create-session` |
| **Login** | `POST /api/auth/login` |
| **Register** | `POST /api/auth/register`, `POST /api/auth/verify-registration` |
| **Forgot Password** | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| **Profile** | `GET /api/auth/profile`, `PUT /api/auth/profile` |
| **Order History** | `GET /api/orders` |
| **Order Detail** | `GET /api/orders/:id` |
| **Contact Us** | `POST /api/contact` |
| **Admin Dashboard** | `POST /api/products` (create), `GET /api/orders`, `PUT /api/orders/:id/status`, `GET /api/contact`, `GET /api/coupons` |

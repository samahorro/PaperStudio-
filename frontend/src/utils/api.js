const BASE_URL = 'http://paperstudio-env.eba-zhfvtb4v.us-east-1.elasticbeanstalk.com/api'

export const registerUser = async (userData) => {
    // userData format: { username, email, password }
    console.log("Mocking Register User API Call:", userData);
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};

export const loginUser = async (credentials) => {
    // credentials format: { username, password }
    console.log("Mocking Login User API Call:", credentials);
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return response.json();
};

// ─── MFA & Registration Confirmations; changed user-> email verif────────────

export const verifyRegistrationCode = async (email, code) => {
    console.log("Mocking Registration Code Verification:", { email, code });
    const response = await fetch(`${BASE_URL}/auth/verify-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });
    return response.json();
};

export const enableMFA = async (token) => {
    console.log("Mocking Enable MFA API Call");
    const response = await fetch(`${BASE_URL}/auth/mfa/enable`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json(); // Usually returns a QR code URL or secret key
};

export const verifyMFA = async (token, mfaCode) => {
    console.log("Mocking Verify MFA Code API Call:", mfaCode);
    const response = await fetch(`${BASE_URL}/auth/mfa/verify`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ mfaCode })
    });
    return response.json();
};

// ──────────────────────────────────────────────────

export const getProfile = async (token) => {
    console.log("Mocking Get Profile API Call");
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};


// ========== PRODUCTS ==========

export const getAllProducts = async () => {
    console.log("Mocking Get All Products API Call");
    const response = await fetch(`${BASE_URL}/products`);
    return response.json();
};

export const createProduct = async (token, formData) => {
    // Note: When using fetch with FormData, DO NOT manually set the 'Content-Type' header.
    // The browser automatically sets it to 'multipart/form-data' along with the correct boundary string.
    console.log("Mocking Create Product API Call (S3 Upload)");
    const response = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    return response.json();
};

export const getProductById = async (id) => {
    console.log("Mocking Get Product By ID API Call:", id);
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return response.json();
};


// ========== CART ==========

export const getCart = async (token) => {
    console.log("Mocking Get Cart API Call");
    const response = await fetch(`${BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

export const addToCart = async (token, productId, quantity, color) => {
    console.log("Mocking Add to Cart API Call:", { productId, quantity });
    const response = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity,color })
    });
    return response.json();
};

export const updateCartItem = async (token, cartItemId, quantity) => {
    console.log("Mocking Update Cart Item API Call:", { cartItemId, quantity });
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    });
    return response.json();
};

export const removeCartItem = async (token, cartItemId) => {
    console.log("Mocking Remove Cart Item API Call:", cartItemId);
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};


// ========== ORDERS & CHECKOUT ==========

export const createCheckoutSession = async (token, orderInfo) => {
    console.log("Mocking Create Checkout Session API Call:", orderInfo);
    const response = await fetch(`${BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderInfo)
    });
    return response.json();
};

export const getUserOrders = async (token) => {
    console.log("Mocking Get User Orders API Call");
    const response = await fetch(`${BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

export const getOrderById = async (token, orderId) => {
    console.log("Mocking Get Order By ID API Call:", orderId);
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

//== password authentication and Profile===//
export const updateProfile = async (token, profileData) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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

export const validateCoupon = async (token, code) => {
    const response = await fetch(`${BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });
    return response.json();
};

export const createStripeSession = async (token, orderId) => {
    const response = await fetch(`${BASE_URL}/payments/create-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
    });
    return response.json();
};

export const submitContactForm = async (contactData) => {
    const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });
    return response.json();
};
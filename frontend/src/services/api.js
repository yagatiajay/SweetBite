const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5018/api';

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    console.warn('Backend categories fallback:', err);
    return [
      { id: 1, name: 'Brownies', slug: 'brownies' },
      { id: 2, name: 'Cookies', slug: 'cookies' },
      { id: 3, name: 'Cakes', slug: 'cakes' },
      { id: 4, name: 'Pastries', slug: 'pastries' }
    ];
  }
}

export async function fetchProducts({ category = 'all', search = '', isVeg = false, isGlutenFree = false } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (isVeg) params.append('isVeg', 'true');
    if (isGlutenFree) params.append('isGlutenFree', 'true');

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.warn('Backend products fallback:', err);
    return [];
  }
}

export async function createOrder(orderPayload) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to place order');
  }
  return await res.json();
}

export async function submitInquiry(inquiryPayload) {
  const res = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryPayload)
  });
  if (!res.ok) throw new Error('Failed to submit inquiry');
  return await res.json();
}

/* User Auth & Profile APIs */
export async function registerUser({ fullName, email, password, phone = '', address = '' }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, phone, address })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }
  return await res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invalid email or password');
  }
  return await res.json();
}

export async function fetchUserOrders(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/user/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to fetch user orders');
    return await res.json();
  } catch (err) {
    console.error('Fetch user orders error:', err);
    return [];
  }
}

/* Admin Management APIs */

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create product');
  }
  return await res.json();
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update product');
  }
  return await res.json();
}

export async function updateProductStock(id, { stockQuantity, isSoldOut }) {
  const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stockQuantity, isSoldOut })
  });
  if (!res.ok) throw new Error('Failed to update stock');
  return await res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return await res.json();
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/products/upload-image`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Image upload failed');
  }
  return await res.json();
}

export async function fetchAllOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/all`);
    if (!res.ok) throw new Error('Failed to fetch all orders');
    return await res.json();
  } catch (err) {
    console.error('Fetch all orders error:', err);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

export async function sendTestEmailNotification(email = 'yagatiajay2@gmail.com') {
  const res = await fetch(`${API_BASE_URL}/orders/test-email?email=${encodeURIComponent(email)}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to send test email');
  return await res.json();
}

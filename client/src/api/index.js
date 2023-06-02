import axios from 'axios';

export const baseURL = 'http://localhost:5001/food-app-83eae/us-central1/app';
export const validateUser = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/api/user/jwtVerification`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    return res.data.user;
  } catch (err) {
    return null;
  }
};

// Add New Product
export const addNewProduct = async (data) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/products/create-product`,
      data
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/products/get-products`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const res = await axios.delete(
      `${baseURL}/api/products/delete-product/${productId}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/user/get-users`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

// add an item to cart

// add new items to the cart
export const addNewItemToCart = async (userId, data) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/products/addToCart/${userId}`,
      { ...data }
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllCartItems = async (userId) => {
  try {
    const res = await axios.get(
      `${baseURL}/api/products/getCartItems/${userId}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

// Cart increment
export const increaseItemQuantity = async (userId, productId, type) => {
  console.log(userId, type, productId);
  try {
    const res = await axios.post(
      `${baseURL}/api/products/updateCart/${userId}`,
      null,
      { params: { productId, type } }
    );
  } catch (err) {
    return null;
  }
};

export const getAllOrder = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/products/orders`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const updateOrderSts = async (orderId, sts) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/products/update-order/${orderId}`,
      null,
      { params: { sts } }
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};

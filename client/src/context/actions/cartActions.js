export const setCartItems = (items) => {
  return {
    type: 'SET_CART_ITEMS',
    items,
  };
};

export const getCartItems = () => {
  return {
    type: 'GET_CART_ITEMS',
  };
};

export const setCartNull = () => {
  return {
    type: 'CLEAR_CART_ITEMS',
    items: null,
  };
};

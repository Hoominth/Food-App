import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { buttonClick, slideIn, staggerFadeInOut } from '../animations';
import { useDispatch, useSelector } from 'react-redux';
import {
  BiChevronsRight,
  FcClearFilters,
  HiCurrencyRupee,
} from '../assets/icon';
import { baseURL, getAllCartItems, increaseItemQuantity } from '../api';
import { setCartItems } from '../context/actions/cartActions';
import { alertNull, alertSuccess } from '../context/actions/alertActions';
import axios from 'axios';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (cart) {
      const resultTotal = cart.reduce(
        (acc, cur) => (acc += cur.productPrice * cur.quantity),
        0
      );
      setTotal(resultTotal);
    }
  }, [cart]);
  const handleCheckOut = () => {
    const data = {
      user,
      cart,
      total,
    };
    axios
      .post(`${baseURL}/api/products/create-checkout-session`, { data })
      .then((res) => {
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed top-0 right-0 z-50 w-300 md:w-508 bg-lightOverlay backdrop-blur-md shadow-md h-screen"
    >
      <div className="w-full flex items-center justify-between py-4 px-6 pb-12">
        <motion.i {...buttonClick} className="cursor-pointer">
          <BiChevronsRight className="text-[50px] text-textColor" />
        </motion.i>
        <p className="text-2xl text-headingColor font-semibold">Your Cart</p>
        <motion.i {...buttonClick} className="cursor-pointer">
          <FcClearFilters className="text-[30px] text-textColor" />
        </motion.i>
      </div>

      <div className="flex-1 flex flex-col items-start justify-start rounded-t-3xl bg-zinc-900 h-full py-6 gap-3 relative">
        {cart && cart?.length > 0 ? (
          <>
            <div className="flex flex-col w-full items-start justify-start gap-3 h-[65%] overflow-y-scroll scrollbar-none px-4">
              {cart &&
                cart?.length > 0 &&
                cart?.map((item, i) => (
                  <CartItemCard key={i} index={i} data={item} />
                ))}
            </div>
            <div className="bg-zinc-800 rounded-t-[60px] w-full h-[35%] flex flex-col items-center justify-center px-4 py-6 gap-24">
              <div className="w-full flex items-center justify-evenly">
                <p className="text-3xl text-zinc-500 font-semibold">Total</p>
                <p className="text-3xl text-orange-500 font-semibold flex items-center justify-center gap-1">
                  <HiCurrencyRupee className="text-primary" />
                  {total}
                </p>
              </div>

              <motion.button
                {...buttonClick}
                onClick={handleCheckOut}
                className="bg-orange-400 w-[70%] mt-0 px-4 py-3 text-xl text-headingColor font-semibold hover:bg-orange-500 drop-shadow-md rounded-2xl"
              >
                Check Out
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl text-primary font-bold">Empty Cart</h1>
          </>
        )}
      </div>
    </motion.div>
  );
};

export const CartItemCard = ({ index, data }) => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [itemTotal, setItemTotal] = useState(0);
  const decrementCart = (productId) => {
    dispatch(alertSuccess('Update the cart item'));
    increaseItemQuantity(user?.user_id, productId, 'decrement').then((data) => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNull());
      });
    });
  };
  const incrementCart = (productId) => {
    dispatch(alertSuccess('Update the cart item'));
    increaseItemQuantity(user?.user_id, productId, 'increment').then((data) => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNull());
      });
    });
  };
  useEffect(() => {
    setItemTotal(data.productPrice * data.quantity);
  }, [itemTotal, cart]);
  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className="w-full flex items-center justify-start bg-zinc-800 rounded-md drop-shadow-md px-4 gap-4"
    >
      <img
        src={data?.imageURL}
        alt="Product"
        className="w-24 min-w-[94px] h-24 object-contain"
      />
      <div className="flex items-center justify-start gap-1 w-full">
        <p className="text-lg text-primary font-semibold">
          {data?.productName}
          <span className="text-sm block capitalize text-gray-400">
            {data?.productCategory}
          </span>
        </p>
        <p className="text-sm flex items-center justify-center gap-1 font-semibold text-red-400 ml-auto">
          <HiCurrencyRupee className="text-red-400" /> {itemTotal}
        </p>
      </div>

      <div className="ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">-</p>
        </motion.div>
        <p className="text-lg text-primary font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          onClick={() => incrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;

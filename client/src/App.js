import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard, Home, Login } from './containers';
import { getAuth } from 'firebase/auth';
import { app } from './configs/firebase.config';
import { getAllCartItems, validateUser } from './api';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './context/actions/userActions';
import { motion } from 'framer-motion';
import { fadeInOut } from './animations';
import { Alert, CheckOutSuccess, Loader, UsersOrder } from './components';
import { setCartItems } from './context/actions/cartActions';

const App = () => {
  const auth = getAuth(app);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);
  useEffect(() => {
    setIsLoading(true);
    auth.onAuthStateChanged((cred) => {
      if (cred) {
        cred.getIdToken().then((token) => {
          validateUser(token).then((data) => {
            if (data) {
              getAllCartItems(data?.user_id).then((items) => {
                dispatch(setCartItems(items));
              });
            }
            dispatch(setUserDetails(data));
          });
        });
      }
      setInterval(() => {
        setIsLoading(false);
      }, 3000);
    });
  }, [auth, dispatch]);
  return (
    <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
      {isLoading && (
        <motion.div
          {...fadeInOut}
          className="fixed z-50 inset-0 bg-lightOverlay backdrop-blur-md flex items-center justify-center w-full"
        >
          <Loader />
        </motion.div>
      )}
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/checkout-success" element={<CheckOutSuccess />} />
        <Route path="/user-orders" element={<UsersOrder />} />
      </Routes>
      {alert?.type && <Alert type={alert?.type} message={alert?.message} />}
    </div>
  );
};

export default App;

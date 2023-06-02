import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Logo } from '../assets';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import { motion } from 'framer-motion';
import { buttonClick, slideTop } from '../animations';
import { MdLogout, MdShoppingCart } from '../assets/icon';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { app } from '../configs/firebase.config';
import { setUserNull } from '../context/actions/userActions';
import { setCartOn } from '../context/actions/displayCartActions';

const Header = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [isMenu, setIsMenu] = useState(false);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSignOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUserNull());
        navigate('/login', { replace: true });
      })
      .catch((err) => console.log(err));
  };
  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6">
      <NavLink to={'/'} className="flex items-center justify-center gap-4">
        <img src={Logo} className="w-12" alt="Logo" />
        <p className="font-semibold text-xl">City</p>
      </NavLink>
      <nav className="flex items-center justify-center gap-8">
        <ul className="hidden md:flex items-center justify-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={'/'}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={'/menu'}
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={'/services'}
          >
            Services
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={'/about-us'}
          >
            About Us
          </NavLink>
        </ul>

        <motion.div
          {...buttonClick}
          onClick={() => {
            dispatch(setCartOn());
          }}
          className="relative cursor-pointer"
        >
          <MdShoppingCart className="text-3xl text-textColor" />
          {cart?.length > 0 && (
            <div className="absolute -top-3 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <p className="text-primary text-base font-semibold">
                {cart?.length}
              </p>
            </div>
          )}
        </motion.div>

        {user ? (
          <>
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsMenu(true)}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden shadow-md">
                <motion.img
                  src={user?.picture ? user?.picture : Avatar}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                ></motion.img>
              </div>
              {isMenu && (
                <motion.div
                  {...slideTop}
                  onMouseLeave={() => setIsMenu(false)}
                  className="px-6 py-4 w-48 bg-lightOverlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
                >
                  {user?.user_id === process.env.REACT_APP_ADMIN_ID && (
                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={'/dashboard/home'}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    className="hover:text-red-500 text-xl text-textColor"
                    to={'/profile'}
                  >
                    My Profile
                  </Link>
                  <Link
                    className="hover:text-red-500 text-xl text-textColor"
                    to={'/user-orders'}
                  >
                    Orders
                  </Link>
                  <hr />
                  <motion.div
                    {...buttonClick}
                    onClick={isSignOut}
                    className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                  >
                    <MdLogout className="text-2xl text-textColor group-hover:text-headingColor" />
                    <p className="text-xl text-textColor group-hover:text-headingColor">
                      Sign Out
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to={'/login'}>
              <motion.div
                {...buttonClick}
                className="px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer"
              >
                Login
              </motion.div>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

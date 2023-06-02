import React, { useEffect, useState } from 'react';
import { LoginBg, Logo } from '../assets';
import { Input } from '../components';
import { FaEnvelope, FaLock, FcGoogle } from '../assets/icon';
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from '../configs/firebase.config';
import { validateUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../context/actions/userActions';
import { alertInfo, alertWarning } from '../context/actions/alertActions';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [navigate, user]);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider).then((userCred) => {
      auth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUser(token).then((data) => {
              dispatch(setUserDetails(data));
            });
            navigate('/', { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPassword = async () => {
    if (email === '' || password === '' || confirmPassword === '') {
      dispatch(alertInfo('Required fields should not be empty'));
    }

    if (password !== confirmPassword) {
      dispatch(alertWarning("Password doesn't match"));
    }

    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCred) =>
        auth.onAuthStateChanged((cred) => {
          if (cred) {
            cred.getIdToken().then((token) => {
              validateUser(token).then((data) => {
                dispatch(setUserDetails(data));
              });
            });
          }
        })
    );
  };

  const signInWithEmailPassword = async () => {
    if (email === '' || password === '') {
      dispatch(alertWarning('Required fields should not be empty'));
    }

    await signInWithEmailAndPassword(auth, email, password).then((userCred) => {
      auth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUser(token).then((data) => {
              dispatch(setUserDetails(data));
            });
            navigate('/', { replace: true });
          });
        }
      });
    });
  };
  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      {/* Background Image */}
      <img
        src={LoginBg}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt="Background Login"
      />

      {/* Content Box */}
      <div className="flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12">
        {/* Top logo section */}
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={Logo} className="w-8" alt="Logo" />
          <p className="text-headingColor font-semibold text-2xl">City</p>
        </div>

        {/* Welcome Text */}
        <p className="text-3xl font-semibold text-headingColor">Welcome Back</p>
        <p className="text-xl text-textColor">
          {signUp ? 'Sign Up' : 'Sign In'} with following
        </p>

        {/* Input Section  */}
        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
          <Input
            placeHolder="Email Here"
            type="email"
            icon={<FaEnvelope className="text-xl text-textColor" />}
            inputState={email}
            onChange={(e) => setEmail(e.target.value)}
            isSignUp={signUp}
          />
          <Input
            placeHolder="Password Here"
            type="password"
            icon={<FaLock className="text-xl text-textColor" />}
            inputState={password}
            onChange={(e) => setPassword(e.target.value)}
            isSignUp={signUp}
          />

          {signUp && (
            <Input
              placeHolder="Confirm Password Here"
              type="password"
              icon={<FaLock className="text-xl text-textColor" />}
              inputState={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isSignUp={signUp}
            />
          )}

          {!signUp ? (
            <p>
              Doesn't have an account:{' '}
              <motion.button
                onClick={() => setSignUp(true)}
                {...buttonClick}
                className="text-red-400 underline cursor-pointer bg-transparent"
              >
                Create one
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account:{' '}
              <motion.button
                onClick={() => setSignUp(false)}
                {...buttonClick}
                className="text-red-400 underline cursor-pointer bg-transparent"
              >
                Sign-in here
              </motion.button>
            </p>
          )}

          {/* Button Section */}
          {signUp ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signUpWithEmailPassword}
            >
              Sign up
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signInWithEmailPassword}
            >
              Sign in
            </motion.button>
          )}
        </div>
        <div className="flex items-center justify-between gap-16">
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <div className="text-white">Or</div>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-3xl" />
          <p className="text-base capitalize text-headingColor">
            Sign in with Google
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

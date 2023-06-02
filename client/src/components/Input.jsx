import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInOut } from '../animations';

const Input = ({ placeHolder, icon, inputState, onChange, type, isSignUp }) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <motion.div
      {...fadeInOut}
      className={`flex items-center justify-center gap-4 bg-lightOverlay backdrop-blur-md rounded-md w-full px-4 py-2 ${
        isFocus ? 'shadow-md shadow-red-200' : 'shadow-none'
      }`}
    >
      {icon}
      <input
        type={type}
        placeholder={placeHolder}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className="w-full h-full bg-transparent text-headingColor text-lg font-semibold border-none outline-none"
      />
    </motion.div>
  );
};

export default Input;

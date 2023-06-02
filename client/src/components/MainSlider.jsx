import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '../components';

const MainSlider = () => {
  return (
    <motion.div className="w-full flex items-center jutify-start flex-col">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl font-bold text-headingColor">
            Our Fresh & Healthy Fruits
          </p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>

      <Slider />
    </motion.div>
  );
};

export default MainSlider;

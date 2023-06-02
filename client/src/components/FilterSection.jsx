import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoFastFood } from 'react-icons/io5';
import { statuses } from '../utils/styles';
import { useSelector } from 'react-redux';
import { SliderCard } from '../components';
import { staggerFadeInOut } from '../animations';

const FilterSection = () => {
  const [category, setCategory] = useState('fruits');
  const products = useSelector((state) => state.products);

  return (
    <motion.div className="w-full flex items-start justify-start flex-col">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl font-bold text-headingColor">Our Hot Dishes</p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>

      <div className="w-full overflow-x-scroll pt-6 flex items-center justify-center gap-6 py-8">
        {statuses &&
          statuses.map((data, i) => (
            <FilterCard
              key={i}
              data={data}
              category={category}
              setCategory={setCategory}
              index={i}
            />
          ))}
      </div>

      <div className="w-full flex items-center justify-evenly flex-wrap gap-4 mt-12">
        {products &&
        products.filter((data) => data.productCategory === category)?.length >
          0 ? (
          products
            .filter((data) => data.productCategory === category)
            .map((data, i) => {
              return <SliderCard key={i} data={data} index={i} />;
            })
        ) : (
          <p className="text-xl text-textColor">
            No products in this category
            {` ${category.slice(0, 1).toUpperCase() + category.slice(1)}`}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export const FilterCard = ({ data, index, category, setCategory }) => {
  return (
    <motion.div
      {...staggerFadeInOut(index)}
      key={index}
      onClick={() => setCategory(data.category)}
      className={`group w-28 min-w-[128px] cursor-pointer rounded-md py-6 ${
        category === data.category ? 'bg-red-500' : 'bg-primary'
      } hover:bg-red-500 shadow-md flex flex-col items-center justify-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center group-hover:bg-primary ${
          category === data.category ? 'bg-primary' : 'bg-red-500'
        }`}
      >
        <IoFastFood
          className={`${
            category === data.category ? 'text-red-500' : 'text-primary'
          }roup-hover:text-red-500`}
        />
      </div>
      <p
        className={`text-xl font-semibold ${
          category === data.category ? 'text-primary' : 'text-textColor'
        } group-hover:text-primary`}
      >
        {data.title}
      </p>
    </motion.div>
  );
};

export default FilterSection;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllProducts } from '../context/actions/productActions';
import { getAllProducts } from '../api';
import { CChart } from '@coreui/react-chartjs';

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const drinks = products?.filter((item) => item.productCategory === 'drinks');
  const deserts = products?.filter(
    (item) => item.productCategory === 'deserts'
  );
  const fruits = products?.filter((item) => item.productCategory === 'fruits');
  const rice = products?.filter((item) => item.productCategory === 'rice');
  const curry = products?.filter((item) => item.productCategory === 'curry');
  const chinese = products?.filter(
    (item) => item.productCategory === 'chinese'
  );
  const bread = products?.filter((item) => item.productCategory === 'bread');
  const dispatch = useDispatch();
  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, []);
  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full h-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="flex items-center justify-center">
          <div className="w-340 md:w-500">
            <CChart
              type="bar"
              data={{
                labels: [
                  'Drinks',
                  'Deserts',
                  'Fruits',
                  'Rice',
                  'Curry',
                  'Bread',
                  'Chinese',
                ],
                datasets: [
                  {
                    label: 'Category wise Count',
                    backgroundColor: '#f87979',
                    data: [
                      drinks?.length,
                      deserts?.length,
                      fruits?.length,
                      rice?.length,
                      curry?.length,
                      bread?.length,
                      chinese?.length,
                    ],
                  },
                ],
              }}
              labels="months"
            />
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-275 md:w-460">
            <CChart
              type="doughnut"
              data={{
                labels: [
                  'Drinks',
                  'Deserts',
                  'Fruits',
                  'Rice',
                  'Curry',
                  'Bread',
                  'Chinese',
                ],
                datasets: [
                  {
                    backgroundColor: [
                      '#41B883',
                      '#E46651',
                      '#00D8FF',
                      '#ba817f',
                      '#d6e38d',
                      '#DD1B16',
                      '#8b4db4',
                    ],
                    data: [
                      drinks?.length,
                      deserts?.length,
                      fruits?.length,
                      rice?.length,
                      curry?.length,
                      bread?.length,
                      chinese?.length,
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;

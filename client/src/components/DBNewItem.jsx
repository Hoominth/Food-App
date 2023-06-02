import React, { useState } from 'react';
import { statuses } from '../utils/styles';
import { Spinner } from '../components';
import { FaCloudUploadAlt, MdDelete } from '../assets/icon';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../configs/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  alertDanger,
  alertNull,
  alertSuccess,
} from '../context/actions/alertActions';
import { buttonClick } from '../animations';
import { addNewProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
// import { Box, LinearProgress, Typography } from '@mui/material';

const DBNewItem = () => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `/images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error: ${error}`));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageDownloadURL(downloadUrl);
          setIsLoading(false);
          setProgress(null);
          dispatch(alertSuccess('Image upload to the cloud'));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);
    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setIsLoading(false);
      dispatch(alertSuccess('Image removed from the cloud'));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
    });
  };

  const submitNewData = () => {
    const data = {
      productName: itemName,
      productCategory: category,
      productPrice: price,
      imageURL: imageDownloadURL,
    };
    addNewProduct(data).then((res) => {
      console.log(res);
      dispatch(alertSuccess('New Item Added'));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
      setImageDownloadURL(null);
      setItemName('');
      setPrice('');
      setCategory(null);
    });
    getAllProducts().then((data) => {
      dispatch(setAllProducts(data));
    });
  };
  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <InputValuField
          type="text"
          placeHolder="Item name here"
          stateValue={itemName}
          stateFunc={setItemName}
        />
        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses?.map((data) => (
              <p
                onClick={() => setCategory(data.category)}
                key={data.id}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${
                  data.category === category
                    ? 'bg-red-400 text-primary'
                    : 'bg-transparent'
                }`}
              >
                {data.title}
              </p>
            ))}
        </div>
        <InputValuField
          type="number"
          placeHolder="Item price here"
          stateFunc={setPrice}
          stateValue={price}
        />

        <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isLoading ? (
            <div className="w-full h-full flex items-center flex-col justify-evenly px-24">
              <Spinner />
              {/* {Math.round(progress > 0) && <span>{Math.round(progress)}</span>} */}
              {Math.round(progress > 0) && (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor">
                      Progress
                    </span>
                    <span className="text-base font-medium text-textColor">
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${Math.round(progress)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {/* {Math.round(progress) > 0 && (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{ width: '100%', mr: 1 }}
                      width={Math.round(progress)}
                    >
                      <LinearProgress variant="determinate" {...progress} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${Math.round(progress)}%`}</Typography>
                    </Box>
                  </Box>
                </Box>
              )} */}
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <>
                  <label htmlFor="uploadImage">
                    <div className="flex items-center justify-center h-full w-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center  cursor-pointer">
                        <p className="font-bold text-4xl">
                          <FaCloudUploadAlt className="-rotate-0" />
                        </p>
                        <p className="text-lg text-textColor">
                          Click to upload an image
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="uploadImage"
                      name="uploadImage"
                      accept="image/*"
                      onChange={uploadImage}
                      hidden
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <motion.img
                      whileHover={{ scale: 1.15 }}
                      src={imageDownloadURL}
                      className="w-full h-full object-cover"
                    />

                    <motion.button
                      {...buttonClick}
                      type="button"
                      className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                      onClick={() => deleteImageFromFirebase(imageDownloadURL)}
                    >
                      <MdDelete className="-rotate-0" />
                    </motion.button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <motion.button
          onClick={submitNewData}
          {...buttonClick}
          className="w-9/12 py-2 rounded-md bg-red-400 text-primary hover:bg-red-500 cursor-pointer"
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};

export const InputValuField = ({
  type,
  placeHolder,
  stateValue,
  stateFunc,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeHolder}
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
        className="w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
      />
    </>
  );
};

export default DBNewItem;

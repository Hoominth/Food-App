import React, { useMemo } from 'react';
import { DataTable } from '../components';
import { Box, IconButton, Tooltip } from '@mui/material';
import { HiCurrencyRupee } from '../assets/icon';
import { useDispatch, useSelector } from 'react-redux';
import { Delete, Edit } from '@mui/icons-material';
import { deleteProduct, getAllProducts } from '../api';
import { alertNull, alertSuccess } from '../context/actions/alertActions';
import { setAllProducts } from '../context/actions/productActions';

const DBItems2 = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'imageURL',
        header: 'Image',
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              className="w-32 h-16 object-contain rounded-md"
              src={row.original.imageURL}
              alt="Product Img"
              loading="lazy"
            />
          </Box>
        ),
      },
      {
        accessorKey: 'productName',
        header: 'Name',
      },
      {
        accessorKey: 'productCategory',
        header: 'Category',
      },
      {
        accessorKey: 'productPrice',
        header: 'Price',
        Cell: ({ row }) => (
          <p className="text-xl font-semibold text-textColor flex items-center">
            <HiCurrencyRupee className="text-red-400" />
            {parseFloat(row.original.productPrice).toFixed(2)}
          </p>
        ),
      },
    ],
    []
  );

  const hanldeDeleteRow = ({ original }) => {
    if (window.confirm('Are you sure, you want to perform this action')) {
      deleteProduct(original.productId).then((res) => {
        dispatch(alertSuccess('Product Deleted'));
        setInterval(() => {
          dispatch(alertNull());
        }, 3000);
        getAllProducts().then((data) => {
          dispatch(setAllProducts(data));
        });
      });
    }
  };
  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={columns}
        data={products}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => console.log('Delete')}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => hanldeDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </div>
  );
};

export default DBItems2;

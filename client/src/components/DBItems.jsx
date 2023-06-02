import React, { useMemo } from 'react';
import {
  Box,
  IconButton,
  ThemeProvider,
  Tooltip,
  createTheme,
} from '@mui/material';
import MaterialReactTable from 'material-react-table';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { HiCurrencyRupee } from '../assets/icon';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { alertNull, alertSuccess } from '../context/actions/alertActions';

const DBItems = () => {
  const defaultTheme = createTheme();
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
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
  const columns = useMemo(
    () => [
      {
        accessorKey: 'imageURL', //simple recommended way to define a column
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
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            {/* <span>{renderedCellValue}</span> */}
          </Box>
        ),
        // muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
        // Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>, //optional custom cell render
      },
      {
        accessorKey: 'productName', //simple recommended way to define a column
        header: 'Name',
      },
      {
        accessorKey: 'productCategory', //simple recommended way to define a column
        header: 'Category',
      },
      {
        accessorKey: 'productPrice', //simple recommended way to define a column
        header: 'Price',
        Cell: ({ renderedCellValue, row }) => (
          <p className="text-xl font-semibold text-textColor flex items-center">
            <HiCurrencyRupee className="text-red-400" />
            {parseFloat(row.original.productPrice).toFixed(2)}
          </p>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full ">
      <ThemeProvider theme={defaultTheme}>
        <MaterialReactTable
          columns={columns}
          data={products}
          enableRowActions
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => console.log('Delete')}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => hanldeDeleteRow(row)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </ThemeProvider>
    </div>
  );
};

export default DBItems;

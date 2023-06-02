import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../api';
import { setAllUserDetails } from '../context/actions/allUserActions';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DataTable } from '../components';
import { Avatar } from '../assets';

const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'photoURL',
        header: 'Image',
        Cell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              className="w-32 h-16 object-contain rounded-md"
              src={row.original.photoURL ? row.original.photoURL : Avatar}
              alt="Product Img"
              loading="lazy"
            />
          </Box>
        ),
      },
      {
        accessorKey: 'displayName',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'emailVerified',
        header: 'Verified',
        Cell: ({ row }) => (
          <p
            className={` text-primary rounded-md px-2 py-1 w-32 text-center ${
              row.original.emailVerified ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {row.original.emailVerified ? 'Verified' : 'Not Verified'}
          </p>
        ),
      },
    ],
    []
  );
  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={columns}
        data={allUsers}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => console.log('edited')}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => console.log('deleted')}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </div>
  );
};

export default DBUsers;

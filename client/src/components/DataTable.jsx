import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import MaterialReactTable from 'material-react-table';

const DataTable = ({ columns, data, renderRowActions }) => {
  const defaultMaterialTheme = createTheme();
  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowActions
        renderRowActions={renderRowActions}
      />
    </ThemeProvider>
  );
};

export default DataTable;

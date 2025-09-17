import React from 'react';
import { Pagination, Box } from '@mui/material';

const PaginationComponent = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // No mostrar la paginación si solo hay una página
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
      />
    </Box>
  );
};

export default PaginationComponent;
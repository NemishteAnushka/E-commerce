import React from 'react';
import { TableRow, TableCell, Button } from '@mui/material';

export default function ProductTableRow({ product, onEdit, onDelete }) {
  return (
    <TableRow sx={{ '&:hover': { bgcolor: '#f0f6fa' } }}>
      <TableCell>
        {product.image ? (
          <img src={product.image} alt={product.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 4, marginRight: 8, backgroundColor: '#e0e0e0' }} />
        )}
        {product.title}
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>{product.sold || 0}</TableCell>
      <TableCell>{product.stock - (product.sold || 0)}</TableCell>
      <TableCell>
        <Button size="small" onClick={onEdit} sx={{ mr: 1 }}>Edit</Button>
        <Button size="small" color="error" onClick={onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
}

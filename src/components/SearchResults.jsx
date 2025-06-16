import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid, Typography, Box } from '@mui/material';
import ProductCard from './ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const products = useSelector(state => state.products.items);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', py: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, color: '#457B9D', fontWeight: 600 }}>
        Search Results for "{searchQuery}"
      </Typography>
      {filteredProducts.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
          No products found matching your search.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 
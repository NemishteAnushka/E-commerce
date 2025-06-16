import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Slider, Paper, Collapse } from '@mui/material';
import ProductCard from './ProductCard';
import { setProducts } from '../slices/cartSlice';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

function getProductsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('products') || '[]');
}

export default function ProductByCategory() {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('relevance');

  React.useEffect(() => {
    const productsFromStorage = getProductsFromLocalStorage();
    dispatch(setProducts(productsFromStorage));
  }, [dispatch]);

  // Get min and max prices from products
  const productPriceRange = products.reduce(
    (acc, product) => ({
      min: Math.min(acc.min, product.price),
      max: Math.max(acc.max, product.price),
    }),
    { min: Infinity, max: -Infinity }
  );

  // Handle price range change
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => 
      p.category && 
      p.category.toLowerCase() === categoryName.toLowerCase() &&
      (searchTerm === '' || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1, sm: 2 }, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#163c45', textAlign: 'center' }}>
        Products in "{categoryName}" Category
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={() => setSearchTerm('')} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => setShowFilters(!showFilters)} edge="end">
                    <FilterListIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#457B9D',
                },
              },
            }}
          />
        </Box>

        {/* Filters */}
        <Collapse in={showFilters}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Price Range</Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={productPriceRange.min}
                  max={productPriceRange.max}
                  sx={{ color: '#457B9D' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">${priceRange[0]}</Typography>
                  <Typography variant="body2">${priceRange[1]}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                    <MenuItem value="name-asc">Name: A to Z</MenuItem>
                    <MenuItem value="name-desc">Name: Z to A</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
        {filteredProducts.length === 0 && (
          <Grid item xs={12}>
            <div style={{ textAlign: 'center', color: '#888', fontSize: 24, marginTop: 40 }}>No products found in this category.</div>
          </Grid>
        )}
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Box, Typography, Button, CircularProgress, Skeleton, TextField, InputAdornment, IconButton, Popper, Paper, List, ListItem, ListItemText, Fade, Slider as MuiSlider, FormControl, InputLabel, Select, MenuItem, Collapse } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import img1 from '../accets/img1.jpg';
import img2 from '../accets/img2.jpg';
import img3 from '../accets/img3.jpg';
import img5 from '../accets/img5.jpg';
import ProductCard from './ProductCard';
import { setProducts } from '../slices/cartSlice';
import { useRole } from '../contexts/RoleContext';
import CategoryButton from './CategoryButton';
import CategoryIconBox from './CategoryIconBox';
import { setSearchTerm } from '../slices/searchSlice';
import { addToCart, addToWishlist, loadUserCart } from '../slices/cartSlice';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

// Sample products for new buyers
const sampleProducts = [
  {
    id: 1,
    title: 'Sample Product 1',
    price: 99.99,
    description: 'This is a sample product for new buyers',
    category: 'Electronics',
    image: img1,
    sellerId: 'sample-seller-1'
  },
  {
    id: 2,
    title: 'Sample Product 2',
    price: 149.99,
    description: 'Another sample product for new buyers',
    category: 'Fashion',
    image: img2,
    sellerId: 'sample-seller-2'
  }
];

const categories = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80' },
];

function getProductsFromLocalStorage() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products.length > 0 ? products : sampleProducts;
}

// Skeleton loader component for products
const ProductSkeleton = () => (
  <Box sx={{ p: 1 }}>
    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1 }} />
    <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
  </Box>
);

const ProductList = () => {
  const { role } = useRole();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const connections = useSelector((state) => state.user.connections) || [];
  const products = useSelector((state) => state.products.items) || [];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('relevance');
  const productsPerPage = 12;
  const observer = useRef();
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Loading ref for infinite scroll
  const loadingRef = useCallback(node => {
    if (loading || !hasMore || !initialLoadComplete) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && initialLoadComplete) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      threshold: 0.1,
      rootMargin: '300px'
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, initialLoadComplete]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(setSearchTerm(term));
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);
    
    // Generate search suggestions
    if (value.length > 0) {
      const suggestions = products
        .filter(p => 
          p.title.toLowerCase().includes(value.toLowerCase()) ||
          p.category.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }

    debouncedSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setSearchSuggestions([]);
    setAnchorEl(null);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(setSearchTerm(''));
    setSearchSuggestions([]);
    setAnchorEl(null);
  };

  // Load products from localStorage
  useEffect(() => {
    const productsFromStorage = getProductsFromLocalStorage();
    dispatch(setProducts(productsFromStorage));
    
    const interval = setInterval(() => {
      const productsFromStorage = getProductsFromLocalStorage();
      dispatch(setProducts(productsFromStorage));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Reset state when filters change
  useEffect(() => {
    setPage(1);
    setDisplayedProducts([]);
    setHasMore(true);
    setInitialLoadComplete(false);
  }, [searchTerm, selectedCategory]);

  // Filter and sort products
  const getFilteredAndSortedProducts = useCallback(() => {
    let filtered = products.filter(p =>
      (selectedCategory === 'All' || (p.category && p.category === selectedCategory)) &&
      (searchTerm === '' || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // relevance - no sorting needed
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchTerm, priceRange, sortBy]);

  // Update displayed products when filters change
  useEffect(() => {
    const filteredProducts = getFilteredAndSortedProducts();
    const initialProducts = filteredProducts.slice(0, productsPerPage);
    setDisplayedProducts(initialProducts);
    setHasMore(filteredProducts.length > productsPerPage);
    setInitialLoadComplete(true);
  }, [getFilteredAndSortedProducts]);

  // Load more products after initial load
  useEffect(() => {
    if (!initialLoadComplete || page === 1 || loading || !hasMore) return;

    setLoading(true);
    const filteredProducts = getFilteredAndSortedProducts();
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = page * productsPerPage;
    const newProducts = filteredProducts.slice(startIndex, endIndex);

    if (newProducts.length === 0) {
      setHasMore(false);
    } else {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setHasMore(endIndex < filteredProducts.length);
    }

    setLoading(false);
  }, [page, getFilteredAndSortedProducts, loading, hasMore, initialLoadComplete]);

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

  useEffect(() => {
    if (currentUser && isInitialLoad) {
      dispatch(loadUserCart({ username: currentUser.username }));
      setIsInitialLoad(false);
    }
  }, [dispatch, currentUser, isInitialLoad]);

  if (!user || user.role !== 'buyer') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Please log in as a buyer to view products
        </Typography>
      </Box>
    );
  }

  const handleAddToCart = (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      showToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }

    // First add to cart
    dispatch(addToCart({ product, username: currentUser.username }));
    
    // Then reload the cart to ensure it's in sync
    dispatch(loadUserCart({ username: currentUser.username }));
    
    showToast('Added to cart', 'success');
  };

  const handleAddToWishlist = (product) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      showToast('Please login to add items to wishlist', 'warning');
      navigate('/login');
      return;
    }
    dispatch(addToWishlist({ product, username: currentUser.username }));
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <Box sx={{ background: 'none', minHeight: '100vh', pb: 6 }}>
      {/* Search Bar and Filters */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 2, mb: 4, px: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={handleClearSearch} edge="end">
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
                <MuiSlider
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

        {/* Search Suggestions */}
        <Popper
          open={Boolean(anchorEl) && searchSuggestions.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{ width: anchorEl?.offsetWidth }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={3} sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
                <List>
                  {searchSuggestions.map((suggestion, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                        },
                      }}
                    >
                      <ListItemText
                        primary={suggestion.title}
                        secondary={suggestion.category}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          mt: { xs: 2, md: 4 },
          mb: 4,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 3, md: 2 },
          bgcolor: 'transparent',
          borderRadius: 3,
          boxShadow: 2,
          minHeight: { xs: 'auto', md: 320 },
        }}
      >
        {/* Text Section */}
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#163c45',
              lineHeight: 1.2,
              fontSize: { xs: 28, sm: 34, md: 42 },
            }}
          >
            Welcome to Our Store
          </Typography>
          <Typography
            sx={{
              mb: 3,
              color: '#555',
              fontSize: { xs: 16, sm: 18 },
              lineHeight: 1.5,
            }}
          >
            Browse our collection of products and find what you need
          </Typography>
        </Box>

        {/* Images */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <img
            src={img1}
            alt="Hero"
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 16,
              boxShadow: '0 8px 32px #0002',
              background: '#fffbe7',
            }}
          />
        </Box>
      </Box>

      {/* Banner Slider */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mb: 4, px: { xs: 1, sm: 2 } }}>
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3000}
          arrows={true}
          pauseOnHover={true}
          cssEase="linear"
          responsive={[
            {
              breakpoint: 768,
              settings: {
                arrows: false,
              }
            }
          ]}
        >
          <div>
            <img 
              src={img1} 
              alt="Banner 1" 
              style={{ 
                width: '100%', 
                height: 'clamp(200px, 40vw, 400px)', 
                objectFit: 'cover', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
          <div>
            <img 
              src={img2} 
              alt="Banner 2" 
              style={{ 
                width: '100%', 
                height: 'clamp(200px, 40vw, 400px)', 
                objectFit: 'cover', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
          <div>
            <img 
              src={img3} 
              alt="Banner 3" 
              style={{ 
                width: '100%', 
                height: 'clamp(200px, 40vw, 400px)', 
                objectFit: 'cover', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
          <div>
            <img 
              src={img5} 
              alt="Banner 4" 
              style={{ 
                width: '100%', 
                height: 'clamp(200px, 40vw, 400px)', 
                objectFit: 'cover', 
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
        </Slider>
      </Box>

      {/* Categories Section */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mb: 4, px: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#163c45', textAlign: 'center' }}>
          Shop Our Top Categories
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
              <CategoryButton
                label={category.name}
                icon={
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                }
                selected={selectedCategory === category.name}
                onClick={() => handleCategoryClick(category.name)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Top Rated Products Section */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mb: 4, px: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#163c45', textAlign: 'center' }}>
          Top Rated Products
        </Typography>
        <Slider
          dots={true}
          infinite={displayedProducts.length > 4}
          speed={500}
          slidesToShow={4}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3000}
          arrows={true}
          pauseOnHover={true}
          responsive={[
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 900,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
              }
            }
          ]}
        >
          {displayedProducts.slice(0, Math.min(displayedProducts.length, 8)).map((product, index) => (
            <Box key={`top-${product.id}-${index}`} sx={{ px: 1 }}>
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onAddToWishlist={() => handleAddToWishlist(product)}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* All Products Section with Infinite Scroll */}
      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', px: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#163c45', textAlign: 'center' }}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </Typography>
        {displayedProducts.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No products found in this category
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {displayedProducts.map((product, index) => (
                <Grid item xs={6} sm={4} md={3} key={`${product.id}-${index}`}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                  />
                </Grid>
              ))}
              {loading && Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} key={`skeleton-${index}`}>
                  <ProductSkeleton />
                </Grid>
              ))}
            </Grid>
            
            {/* Loading trigger - only show after initial load */}
            {initialLoadComplete && hasMore && (
              <Box 
                ref={loadingRef}
                sx={{ 
                  height: '20px',
                  mt: 2,
                  mb: 4
                }}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProductList;

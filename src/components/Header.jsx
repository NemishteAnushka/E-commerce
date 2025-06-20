import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';

export default function Header() {
  const cartCount = useSelector(state => state.products.cart.length);
  const wishlistCount = useSelector(state => state.products.wishlist.length);
  const navigate = useNavigate();
  const { role, logout } = useRole();
  console.log(role,"role")
  const currentUser = role ? JSON.parse(localStorage.getItem('currentUser')) : null;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  // Drawer content for mobile
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        <ListItem button onClick={() => navigate('/')}> 
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {role === 'buyer' && (
          <>
            <ListItem button onClick={() => navigate('/cart')}>
              <ListItemIcon>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem button onClick={() => navigate('/wishlist')}>
              <ListItemIcon>
                <Badge badgeContent={wishlistCount} color="primary">
                  <FavoriteBorderIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Wishlist" />
            </ListItem>
          </>
        )}
        {role && currentUser && (
          <ListItem>
            <ListItemText primary={currentUser.username} sx={{ color: '#457B9D', fontWeight: 600 }} />
          </ListItem>
        )}
        {role && (
          <ListItem button onClick={() => { logout(); navigate('/login'); }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: 'transparent', background: 'linear-gradient(90deg,rgb(227, 234, 235) 0%,rgb(119, 174, 209) 100%)', color: '#222', boxShadow: '0 2px 8px #457B9D44', zIndex: 1201 }}>
        <Toolbar>
          {/* Hamburger for mobile */}
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mr: 1 }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer', color: '#457B9D', fontWeight: 700 }} onClick={() => navigate('/')}>E-Commerce App</Typography>
          {/* Desktop icons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            {role === 'customer' && (
              <>
                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
                  <Badge badgeContent={wishlistCount} color="primary">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </>
            )}
            {role === 'vendor' && (
              <>
                <IconButton color="inherit" onClick={() => navigate('/seller/products')}>
                  <StoreIcon />
                </IconButton>
                <IconButton color="inherit" onClick={() => navigate('/seller/connections')}>
                  <PeopleIcon />
                </IconButton>
              </>
            )}
            {role && currentUser && (
              <Typography variant="body2" sx={{ color: '#457B9D', fontWeight: 600, mr: 2 }}>
                {currentUser.username}
              </Typography>
            )}
            {role && (
              <IconButton color="inherit" onClick={() => { logout(); navigate('/login'); }}>
                <LogoutIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer for mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}

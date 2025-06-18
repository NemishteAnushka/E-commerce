import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper
} from '@mui/material';

function AdminPage() {
  const [categoryName, setCategoryName] = useState('');
  const [isActive, setIsActive] = useState('yes');
  const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});


   const handleSubmit = () => {
    const newErrors = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    } else if (
      categories.some(cat => cat.name.toLowerCase() === categoryName.trim().toLowerCase())
    ) {
      newErrors.categoryName = 'Category name already exists';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors
    setCategories([...categories, { name: categoryName.trim(), active: isActive }]);
    setCategoryName('');
    setIsActive('yes');
    setErrors({});
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Category Name"
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          error={!!errors.categoryName}
          helperText={errors.categoryName}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Category Active</InputLabel>
          <Select
            value={isActive}
            label="Is Active"
            onChange={(e) => setIsActive(e.target.value)}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Category Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.active === 'yes' ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminPage;

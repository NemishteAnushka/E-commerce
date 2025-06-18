import React, { useEffect, useState } from "react";
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
  Paper,
} from "@mui/material";
import axios from "axios";

function AdminPage() {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState("yes");
  const [categories, setCategories] = useState([]);
  console.log("categories", categories);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required";
    } else if (
      categories.some(
        (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      newErrors.name = "Category name already exists";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const authToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/categories/",
        {
          name: name.trim(),
          is_active: isActive === "yes" ? true : false,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data, "response data");

      // Update categories list with response data (better to use server response than local data)
      setName("");
      setIsActive("yes");
      setErrors({});
    } catch (error) {
      // You can add more detailed error handling here
      console.error("Failed to create category:", error);
      setErrors({ submit: "Failed to create category. Please try again." });
    }
  };
  useEffect(() => {
    const authToken = localStorage.getItem("accessToken");

    const getCategories = async () => {
      const getResponse = await axios.get(
        "http://127.0.0.1:8000/api/categories/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(getResponse.data);
    };
    getCategories();
  }, []);
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Category Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
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
                <TableCell>
                  {category.is_active === true ? "Yes" : "No"}
                </TableCell>
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

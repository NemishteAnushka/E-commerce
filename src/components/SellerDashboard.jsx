import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Pagination,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import { useRole } from "../contexts/RoleContext";
import DashboardSummaryCard from "./DashboardSummaryCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}
function setProductsToStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

export default function SellerDashboard() {
  const { role } = useRole();
  const user = getCurrentUser();
  const [products, setProductsState] = useState([]);
  console.log(products, "products");
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  console.log(editIndex, "editIndex");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const productsPerPage = 5;
  const { showToast } = useToast();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories/"
        );
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getCategories();
  }, []);

  useEffect(() => {
    const getProductsFromApi = async () => {
      const authToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setProductsState(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        showToast("Failed to fetch products from server", "error");
      }
    };
    getProductsFromApi();
  
  }, [role, user && user.username]);

  // Dashboard summary
  const totalProducts = products.length;
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  // Chart data for graph
  const chartData = [
    { name: "Total Products", value: totalProducts },
    { name: "Total Sold", value: totalSold },
    { name: "In Stock", value: totalStock },
  ];

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = (product, idx) => {
    setEditIndex(idx);
    setForm(
      product || {
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: "",
      }
    );
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file })); // save raw file
  };

const handleSave = async () => {
  const authToken = localStorage.getItem("accessToken");

  console.log("editIndex:", editIndex);

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("price", form.price);
  formData.append("stock", form.stock);
  formData.append("category", form.category);
  formData.append("description", form.description);
  formData.append("is_active", true);
  if (form.imageFile) {
    formData.append("image", form.imageFile);
  }

  try {
    let response;

    if (editIndex !== null) {
      // const productId = products[editIndex]?.id;
      // console.log(productId, "productId");
      // console.log("Calling PUT for product ID:", productId);

      response = await axios.put(
        `http://127.0.0.1:8000/api/products/${editIndex}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } else {
      console.log("Calling POST for new product");
      response = await axios.post(
        `http://127.0.0.1:8000/api/products/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    }

    console.log("Response:", response.data);
    showToast("Saved successfully", "success");
    handleClose();
    window.location.reload();
  } catch (error) {
    console.error("Save failed:", error.response?.data || error.message);
    showToast("Save failed", "error");
  }
};



  const handleDelete = async (idx) => {
    const authToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/products/${idx}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response) {
        showToast("Product deleted successfully", "info");
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      showToast("Failed to delete product from server", "error");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1280,
        mx: "auto",
        p: 4,
        bgcolor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" fontWeight={700} color="#1565c0" gutterBottom>
        Seller Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Manage your products, track sales and inventory with ease.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: 3,
            }}
          >
            <Avatar sx={{ bgcolor: "#1e88e5", m: 2, width: 56, height: 56 }}>
              <StorefrontIcon fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Products
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#1565c0">
                {totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: 3,
            }}
          >
            <Avatar sx={{ bgcolor: "#43a047", m: 2, width: 56, height: 56 }}>
              <ShoppingCartIcon fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Sold
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#2e7d32">
                {totalSold}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: 3,
            }}
          >
            <Avatar sx={{ bgcolor: "#fb8c00", m: 2, width: 56, height: 56 }}>
              <InventoryIcon fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
              >
                In Stock
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#ef6c00">
                {totalStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar Chart Card */}
      <Card sx={{ mb: 5, boxShadow: 4, borderRadius: 3, bgcolor: "white" }}>
        <CardHeader
          avatar={<BarChartIcon color="primary" />}
          title={
            <Typography variant="h6" fontWeight={700} color="#1565c0">
              Sales Overview
            </Typography>
          }
          sx={{ borderBottom: "1px solid #eee" }}
        />
        <CardContent sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#1565c0", fontWeight: "600" }}
              />
              <YAxis allowDecimals={false} tick={{ fill: "#1565c0" }} />
              <RechartTooltip />
              <Bar dataKey="value" fill="#1565c0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#1565c0">
          Your Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            bgcolor: "#1565c0",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 3,
            px: 3,
            py: 1.2,
            "&:hover": { bgcolor: "#0d47a1" },
          }}
          onClick={() => handleOpen(null, null)}
        >
          Add New Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
        <Table sx={{ minWidth: 700 }} aria-label="products table">
          <TableHead sx={{ bgcolor: "#e3f2fd" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Category
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Stock
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Sold
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Remaining
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ color: "#999", fontSize: 18, py: 5 }}
                >
                  <InfoOutlinedIcon
                    sx={{ mr: 1, verticalAlign: "middle", color: "#1976d2" }}
                  />{" "}
                  No products found. Click "Add New Product" to get started.
                </TableCell>
              </TableRow>
            )}
            {paginatedProducts?.map((p, idx) => (
              <TableRow
                key={p.id}
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "#f9fafd" },
                  "&:hover": { bgcolor: "#e3f2fd" },
                  cursor: "default",
                }}
              >
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.sold || 0}</TableCell>
                <TableCell>{p.stock - (p.sold || 0)}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Product">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(p, p.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(p.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 700,
                color: "#1565c0",
                "&.Mui-selected": {
                  backgroundColor: "#1565c0",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#0d47a1" },
                },
              },
            }}
          />
        </Box>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 420 } }}
      >
        <DialogTitle fontWeight={700} color="#1565c0">
          {editIndex !== null ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              required
            >
              {category.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.name}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Upload Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
             
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: "#1565c0",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              "&:hover": { bgcolor: "#0d47a1" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

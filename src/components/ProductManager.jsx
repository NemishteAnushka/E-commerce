import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct, deleteProduct } from '../slices/cartSlice';

const ProductManager = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const products = useSelector((state) => state.products.items);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      dispatch(updateProduct({ ...formData, id: editingProduct.id }));
    } else {
      dispatch(addProduct({ ...formData, sellerId: user.id }));
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId));
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
    });
  };

  if (!user || user.type !== 'seller') return null;

  const sellerProducts = products.filter((product) => product.sellerId === user.id);

  return (
    <div className="product-manager">
      <h2>Manage Your Products</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Product Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />
        <div className="form-buttons">
          <button type="submit">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="products-list">
        <h3>Your Products</h3>
        {sellerProducts.length === 0 ? (
          <p>No products yet</p>
        ) : (
          sellerProducts.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.image} alt={product.name} />
              <div className="product-details">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p className="price">${product.price}</p>
              </div>
              <div className="product-actions">
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .product-manager {
          padding: 20px;
        }

        .product-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 500px;
          margin-bottom: 30px;
        }

        .product-form input,
        .product-form textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .product-form textarea {
          min-height: 100px;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
        }

        .form-buttons button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .form-buttons button[type="submit"] {
          background-color: #28a745;
          color: white;
        }

        .form-buttons button[type="button"] {
          background-color: #6c757d;
          color: white;
        }

        .products-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .product-item {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .product-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .product-details {
          padding: 15px;
        }

        .product-details h4 {
          margin: 0 0 10px 0;
        }

        .price {
          font-weight: bold;
          color: #28a745;
        }

        .product-actions {
          display: flex;
          gap: 10px;
          padding: 15px;
          border-top: 1px solid #ddd;
        }

        .product-actions button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .product-actions button:first-child {
          background-color: #007bff;
          color: white;
        }

        .product-actions button:last-child {
          background-color: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ProductManager; 
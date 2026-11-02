
import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';

const endpoint = 'http://localhost:5000/graphql';

// Fetch all products
const query = gql`
  {
    products {
      id
      name
      price
    }
  }
`;

// Add a new product
const mutation = gql`
  mutation AddProduct($name: String, $price: Float) {
    addProduct(name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: ''
  });

  // Fetch products when page loads
  useEffect(() => {
    request(endpoint, query)
      .then(data => setProducts(data.products))
      .catch(error => console.error(error));
  }, []);

  // Add product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await request(endpoint, mutation, {
        name: form.name,
        price: parseFloat(form.price)
      });

      const data = await request(endpoint, query);
      setProducts(data.products);

      setForm({ name: '', price: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>GraphQL Product Management</h1>

      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Product Price"
          value={form.price}
          onChange={e =>
            setForm({ ...form, price: e.target.value })
          }
          min="0"
          step="0.01"
          required
        />

        <button type="submit">Add Product</button>
      </form>

      <h2>Product List</h2>

      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - Rs. {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

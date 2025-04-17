// server.js - Node.js server with AppDynamics integration
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// AppDynamics Configuration
const APPDYNAMICS_CONFIG = {
  controllerHostName: 'controller-IP-hostname',
  controllerPort: PORT-Number,
  controllerSslEnabled: true,
  accountName: 'customer1',
  accountAccessKey: 'eeds1224-087-863f-fc6d72ab',
  applicationName: 'Analytics-Test-App',
  tierName: 'WebTier',
  nodeName: 'TestNode-' + Math.floor(Math.random() * 1000)
};

// Initialize AppDynamics (must be first)
require('appdynamics').profile(APPDYNAMICS_CONFIG);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory database
const db = {
  products: [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 50 },
    { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics', stock: 100 },
    { id: 3, name: 'Headphones', price: 149.99, category: 'Audio', stock: 200 },
    { id: 4, name: 'Monitor', price: 299.99, category: 'Electronics', stock: 30 }
  ],
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'regular' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'regular' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', type: 'admin' }
  ],
  orders: []
};

// Analytics Endpoint
app.post('/api/analytics', (req, res) => {
  const event = req.body;
  console.log('[Analytics Event]', event);
  
  // Here you would normally send to AppDynamics analytics
  // For this test, we'll just log it
  
  res.status(200).json({ status: 'received' });
});

// Product Endpoints
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// User Endpoints
app.get('/api/users', (req, res) => {
  res.json(db.users);
});

// Order Endpoints
app.post('/api/orders', (req, res) => {
  const order = {
    id: uuidv4(),
    ...req.body,
    status: 'completed',
    date: new Date()
  };
  db.orders.push(order);
  res.status(201).json(order);
});

// Start server
app.listen(PORT, () => {
  console.log(`AppDynamics Analytics Test Server running on port ${PORT}`);
  console.log('AppDynamics Controller:', APPDYNAMICS_CONFIG.controllerHostName);
  console.log('Application Name:', APPDYNAMICS_CONFIG.applicationName);
});
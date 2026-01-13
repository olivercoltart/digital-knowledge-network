const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const resourceRoutes = require("./routes/resource.routes");

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use('/api', authRoutes);

// mounting resource routes
app.use("/api/resources", resourceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;

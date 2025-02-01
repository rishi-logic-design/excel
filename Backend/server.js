// server.js
const express = require('express');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middlewares/errorHandler');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Aapke frontend ka URL
  }));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);
app.post('/api/files/upload', (req, res) => {
    res.json({ message: 'File uploaded successfully' });
  });

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

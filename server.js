// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const { errorHandler } = require('./middleware/errorMiddleware');

// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/jobs', require('./routes/jobRoutes'));

// // Error handler
// app.use(errorHandler);

// // ✅ IMPORTANT: Render requires app.listen()
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Root route (ADD THIS)
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Error handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
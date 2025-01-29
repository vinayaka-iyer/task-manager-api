const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("../routes/taskRoutes");
const authRoutes = require("../routes/authRoutes");
const errorMiddleware = require("../middlewares/errorMiddleware");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-manager-frontend-jet-nu.vercel.app",
      "https://task-manager-eight-olive.vercel.app",
      "https://event-manager-rosy.vercel.app",
    ],
    credentials: true, // Allow credentials like cookies or HTTP authentication
  })
);
app.use(express.json());

// Connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// 404 Handler for undefine routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
  });
});

// Global error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

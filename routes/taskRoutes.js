const express = require("express");

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const authenticate = require("../middlewares/auth");

const router = express.Router();
// Protect all routes with authentication middleware
// router.use(authenticate);

// Task Routes
router.get("/", authenticate, getTasks); // GET all Tasks
router.get("/:id", authenticate, getTaskById); // GET Task by ID
router.post("/", authenticate, createTask); // POST create Task
router.put("/:id", authenticate, updateTask); // PUT update Task
router.delete("/:id", authenticate, deleteTask); // DELETE Task

module.exports = router;

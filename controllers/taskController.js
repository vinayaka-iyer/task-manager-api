const Task = require("../models/Task");

// Get all tasks
const getTasks = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  try {
    const total = await Task.countDocuments({ user: userId });
    const tasks = await Task.find({ user: userId })
      .skip(startIndex)
      .limit(limit);
    res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const task = await Task.findById({ user: userId, _id: id });
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    return next(error);
  }
  res.status(200).json(task);
};

// Create a new task
const createTask = async (req, res, next) => {
  const userId = req.user.id;
  const { title, description, status } = req.body;
  if (!title) {
    const error = new Error("Title is required.");
    error.status = 400;
    return next(error);
  }
  const task = new Task({ title, description, status, user: userId });
  await task.save();
  res.status(201).json({ message: "Task created successfully." });
};

// Update a task
const updateTask = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updateFields = req.body;
  updateFields.updated_at = Date.now();
  const task = await Task.findByIdAndUpdate(
    { user: userId, _id: id },
    { $set: updateFields }, // Use $set to only update the provided fields
    { new: true, runValidators: true } // Return updated document and run validation
  );
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    return next(error);
  }
  res.status(200).json(task);
};

// Delete a task
const deleteTask = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const task = await Task.findByIdAndDelete({ user: userId, _id: id });
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    return next(error);
  }
  res.status(200).json({ message: "Task deleted successfully." });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };

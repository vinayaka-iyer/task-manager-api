const Task = require('../models/Task');


// Get all tasks
const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find()
		res.status(200).json(tasks)
	} catch (error) {
		res.status(500).json({message: error.message})

	}
};

// Get task by ID
const getTaskById = async (req, res, next) => {
    const task = await Task.findById(req.params.id);
	if (!task) {
		const error = new Error('Task not found.');
		error.status = 404;
		return next(error);
	}
    res.status(200).json(task);
};

// Create a new task
const createTask = async (req, res, next) => {
	const { title, description } = req.body;
	if (!title || !description) {
		const error = new Error('Title and Description are required.');
		error.status = 400;
		return next(error);
	}
	const task = new Task({title, description})
	await task.save()
	res.status(201).json(task);
};

// Update a task
const updateTask = async (req, res, next) => {
	const updateFields = req.body;
	updateFields.updated_at = Date.now()
	const task = await Task.findByIdAndUpdate(req.params.id,
		{ $set: updateFields }, // Use $set to only update the provided fields
		{ new: true, runValidators: true } // Return updated document and run validation
	)
	if (!task) {
		const error = new Error('Task not found.');
		error.status = 404;
		return next(error);
	}
	res.status(200).json(task);
};

// Delete a task
const deleteTask = async (req, res, next) => {
	const task = await Task.findByIdAndDelete(req.params.id)
	if (!task) {
		const error = new Error('Task not found.');
		error.status = 404;
		return next(error);
	}
	res.status(200).json({ message: 'Task deleted successfully.' });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };

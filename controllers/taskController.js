// In-memory array of tasks
const tasks = [];

// Get all tasks
const getTasks = (req, res) => {
	res.json(tasks);
};

// Get task by ID
const getTaskById = (req, res, next) => {
	const task = tasks.find((t) => t.id === parseInt(req.params.id));
	if (!task) {
		const error = new Error('Task not found.');
		error.status = 404;
		return next(error);
	}
	res.json(task);
};

// Create a new task
const createTask = (req, res, next) => {
	const { title, description } = req.body;
	if (!title || !description) {
		const error = new Error('Title and Description are required.');
		error.status = 400;
		return next(error);
	}
	const newTask = {
		id: tasks.length,
		title,
		description,
		status: 'Pending',
		created_at: new Date().toLocaleString(),
		updated_at: null,
	};
	tasks.push(newTask);
	res.status(201).json(newTask);
};

// Update a task
const updateTask = (req, res, next) => {
	const task = tasks.find((t) => t.id === parseInt(req.params.id));
	if (!task) {
		const error = new Error('Task not found.');
		error.status = 404;
		return next(error);
	}
	const { title, description, status } = req.body;
	if (title) task.title = title;
	if (description) task.description = description;
	if (status) task.status = status;
	task.updated_at = new Date().toLocaleString();
	res.json(task);
};

// Delete a task
const deleteTask = (req, res, next) => {
	const task = tasks.find((t) => t.id === parseInt(req.params.id));
	if (!task) {
		const error = new Error('Task not found.');
		error.status = 404;
		return next(error);
	}
	tasks.splice(task.id, 1);
	res.status(201).json({ message: 'Task deleted successfully.' });
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };

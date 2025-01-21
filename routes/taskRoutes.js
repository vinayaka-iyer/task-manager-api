const express = require('express');

const {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// Task Routes
router.get('/', getTasks); // GET all Tasks
router.get('/:id', getTaskById); // GET Task by ID
router.post('/', createTask); // POST create Task
router.put('/:id', updateTask); // PUT update Task
router.delete('/:id', deleteTask); // DELETE Task

module.exports = router;

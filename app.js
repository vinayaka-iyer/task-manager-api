const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// 404 Handler for undefine routes
app.use((req, res, next) => {
	res.status(404).json({
		error: 'Route not found',
		method: req.method,
		url: req.originalUrl,
	});
});

// Global error handler
app.use(errorMiddleware);

app.listen(process.env.PORT || 8000, () => {
	console.log('Listening on port 8000...');
});

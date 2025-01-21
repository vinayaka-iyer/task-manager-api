const express = require('express');
const mongoose = require('mongoose')
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());

// Connect to db
mongoose.connect('mongodb+srv://vinayakaiyer:vinayaka999@cluster0.fgiui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes)

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

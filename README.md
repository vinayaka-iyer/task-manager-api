## **Project Documentation: Task Management API**

### **Project Structure**

The project follows a MVC Architecture. Below is the file structure:

```
project/
├── app.js
├── routes/
│   └── taskRoutes.js
│   └── authRoutes.js
├── controllers/
│   └── taskController.js
│   └── authController.js
├── middlewares/
│   └── errorMiddleware.js
│   └── auth.js
└── models/
    └── Task.js
    └── User.js

```

---

### **Example API Usage**

#### **1. Fetch All Tasks**

-   **Request**: `GET /api/tasks?page=1&limit=4`
-   **Response**:
    ```json
	{
		"page": 1,
		"limit": 4,
		"total": 11,
		"pages": 3,
		"tasks": [
			{
				"_id": "6790934e28f54f0e8884424e",
				"title": "Demo task 1",
				"description": "This is a another task",
				"status": "Pending",
				"updated_at": null,
				"user": "679084275259831a46025de3",
				"created_at": "2025-01-22T06:42:22.377Z",
				"__v": 0
			},
			{
				"_id": "6790935328f54f0e88844250",
				"title": "Demo task 2",
				"description": "This is a another task",
				"status": "Pending",
				"updated_at": null,
				"user": "679084275259831a46025de3",
				"created_at": "2025-01-22T06:42:27.244Z",
				"__v": 0
			},
    	]
	}
    ```

#### **2. Fetch Task by ID**

-   **Request**: `GET /api/tasks/0`
-   **Response**:
    ```json
    {
    	"id": 0,
    	"title": "task1",
    	"description": "this is a sample task",
    	"status": "Pending",
    	"created_at": "21/01/2025, 08:31:02",
    	"updated_at": null
    }
    ```

#### **3. Create a New Task**

-   **Request**: `POST /api/tasks/`
    ```json
    {
    	"title": "New Task",
    	"description": "Description of the new task"
    }
    ```
-   **Response**:
    ```json
    {
    	"id": 2,
    	"title": "New Task",
    	"description": "Description of the new task",
    	"status": "Pending",
    	"created_at": "21/01/2025, 09:30:00",
    	"updated_at": null
    }
    ```

#### **4. Update an Existing Task**

-   **Request**: `PUT /api/tasks/0`
    ```json
    {
    	"title": "Updated Task",
    	"description": "Updated task description",
    	"status": "Completed"
    }
    ```
-   **Response**:
    ```json
    {
    	"id": 0,
    	"title": "Updated Task",
    	"description": "Updated task description",
    	"status": "Completed",
    	"created_at": "21/01/2025, 08:31:02",
    	"updated_at": "21/01/2025, 09:45:00"
    }
    ```

#### **5. Delete a Task**

-   **Request**: `DELETE /api/tasks/0`
-   **Response**:
    ```json
    {
    	"message": "Task deleted successfully"
    }
    ```

#### **6. Register a User**

-   **Request**: `POST /api/auth/register`
    ```json
    {
    	"username": "user",
    	"password": "password123",
    }
-   **Response**:
    ```json
    {
    	"message": "User registered successfully"
    }
    ```

#### **7. Login**

-   **Request**: `POST /api/auth/login`
    ```json
    {
    	"username": "user",
    	"password": "password123",
    }
-   **Response**:
    ```json
    {
		"message": "Login successful",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzkwODQyNzUyNTk4MzFhNDYwMjVkZTMiLCJpYXQiOjE3Mzc1MjgwNTYsImV4cCI6MTczNzUzMTY1Nn0.xhOoGHtZ3DDzgbyCePOSXifQvl898q_g39AiSK4AADQ"
    }
    ```

## Versioning and Updates

### Version 1.3
- Added pagination to limit the number of tasks fetched during GET all tasks.

### Version 1.2
- Added persistent MongoDB database integration using Mongoose.

### Version 1.1
- Added validation for task fields.
- Implemented a centralized error-handling middleware to standardize error responses.
- Introduced a 404 handler for undefined routes. 

### Version 1.0
Initial version of the API with the following features:
- CRUD operations for tasks (GET, POST, PUT, DELETE).
- Basic in-memory data storage.
---

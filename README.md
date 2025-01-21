## **Project Documentation: Task Management API**

### **Project Structure**

The project follows a MVC Architecture. Below is the file structure:

```
project/
├── app.js
├── routes/
│   └── taskRoutes.js
├── controllers/
│   └── taskController.js
├── middlewares/
│   └── errorMiddleware.js
└── models/
    └── taskModel.js

```

---

### **Example API Usage**

#### **1. Fetch All Tasks**

-   **Request**: `GET /api/tasks/`
-   **Response**:
    ```json
    [
    	{
    		"id": 0,
    		"title": "task1",
    		"description": "this is a sample task",
    		"status": "Pending",
    		"created_at": "21/01/2025, 08:31:02",
    		"updated_at": null
    	},
    	{
    		"id": 1,
    		"title": "task2",
    		"description": "this is another task",
    		"status": "In Progress",
    		"created_at": "21/01/2025, 09:00:00",
    		"updated_at": "21/01/2025, 09:15:00"
    	}
    ]
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

---

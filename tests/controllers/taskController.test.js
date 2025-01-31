const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../api/index"); // Ensure your Express app is properly exported in app.js
const Task = require("../../models/Task");
const mongoose = require("mongoose");
jest.mock("../../models/Task");

const mockUserId = new mongoose.Types.ObjectId();
const mockTaskId = new mongoose.Types.ObjectId();
const mockTask = {
  _id: mockTaskId.toString(),
  title: "Test Task",
  description: "This is a test task",
  status: "Pending",
  user: mockUserId.toString(),
};

// Generate mock JWT token
const mockToken = jwt.sign({ id: mockUserId }, "my_jwt_secret");

// Middleware to mock authentication
jest.mock("../../middlewares/auth", () => (req, res, next) => {
  req.user = { id: mockUserId };
  next();
});

describe("Task API Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("should return paginated tasks", async () => {
      Task.countDocuments.mockResolvedValue(1);
      Task.find.mockImplementation(() => ({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockTask]),
      }));

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0]).toMatchObject(mockTask);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return a single task", async () => {
      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .get(`/api/tasks/${mockTaskId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(mockTask);
    });

    it("should return 404 if task not found", async () => {
      Task.findById.mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/tasks/${mockTaskId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      Task.prototype.save = jest.fn().mockResolvedValue();

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Test Task",
          description: "This is a test task",
          status: "Pending",
        });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Task created successfully.");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task", async () => {
      Task.findByIdAndUpdate.mockResolvedValue({
        ...mockTask,
        title: "Updated Title",
      });

      const res = await request(app)
        .put(`/api/tasks/${mockTaskId}`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Updated Title",
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Title");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      Task.findByIdAndDelete.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete(`/api/tasks/${mockTaskId}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Task deleted successfully.");
    });
  });
});

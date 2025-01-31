const request = require("supertest");
const app = require("../../api/index");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

jest.mock("../../models/User"); // Mock the User model

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Register", () => {
    it("should return 400 if username or password is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username and Password is required");
    });

    it("should return 400 if username already exists", async () => {
      User.findOne.mockResolvedValue({ username: "testuser" });

      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username already exists");
    });

    it("should return 201 if user is registered successfully", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue();

      const res = await request(app).post("/api/auth/register").send({
        username: "newuser",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User resgisted successfully.");
    });

    it("should return 500 if server error occurs", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Server Error");
    });
  });

  describe("Login", () => {
    it("should return 400 if username or password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Username and Password is required");
    });

    it("should return 400 if user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        username: "nonexistent",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid username or password");
    });

    it("should return 400 if password is incorrect", async () => {
      const mockUser = {
        username: "testuser",
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid username or password");
    });

    it("should return 200 and a token if login is successful", async () => {
      const mockUser = {
        _id: "123",
        username: "testuser",
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue("mockToken");

      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBe("mockToken");
    });

    it("should return 500 if server error occurs", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Server Error");
    });
  });
});

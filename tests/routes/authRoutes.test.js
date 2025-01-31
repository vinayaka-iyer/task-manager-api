const request = require("supertest");
const app = require("../../api/index"); // Import your Express app
const authController = require("../../controllers/authController");

// Mock the controller methods
jest.mock("../../controllers/authController", () => ({
  register: jest.fn((req, res) =>
    res.status(201).json({ message: "User registered" })
  ),
  login: jest.fn((req, res) => res.status(200).json({ token: "mockToken" })),
}));

describe("Auth Routes", () => {
  it("should call register controller on POST /api/auth/register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "test", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "User registered" });
  });

  it("should call login controller on POST /api/auth/login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "test", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "mockToken" });
  });
});

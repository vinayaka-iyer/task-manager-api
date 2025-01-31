const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middlewares/auth");

const JWT_SECRET = "my_jwt_secret";

const app = express();
app.use(express.json());
app.get("/protected", authenticate, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});

describe("Auth Middleware", () => {
  let validToken;

  beforeAll(() => {
    validToken = jwt.sign(
      { userId: "12345", username: "testuser" },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid_token");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  it("should grant access if a valid token is provided", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Access granted");
    expect(res.body.user).toEqual({ id: "12345" });
  });
});

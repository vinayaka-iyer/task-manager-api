const request = require("supertest");
const app = require("../../api/index");

describe("Task Routes - Authentication", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/tasks"); // No token

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 401 if invalid token is provided", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", "Bearer invalid_token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });
});

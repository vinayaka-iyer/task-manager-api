const request = require("supertest");
const app = require("../../api/index");

describe("Express App", () => {
  it("should respond with 404 for undefined routes", async () => {
    const response = await request(app).get("/undefined-route");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Route not found");
  });

  it("should handle errors with errorMiddleware correctly", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Route not found");
  });
});

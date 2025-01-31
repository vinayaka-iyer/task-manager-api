const request = require("supertest");
const express = require("express");
const errorMiddleware = require("../../middlewares/errorMiddleware");

const app = express();

// Sample routes to trigger an error
app.get("/error", (req, res, next) => {
  const error = new Error("Something went wrong");
  error.status = 400;
  next(error);
});

app.get("/server-error", (req, res, next) => {
  const error = new Error(); // No message, no status
  next(error); // Pass error to middleware
});

// Apply error middleware
app.use(errorMiddleware);

describe("Error Middleware", () => {
  it("should return the correct error message and status code", async () => {
    const response = await request(app).get("/error");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        message: "Something went wrong",
      },
    });
  });

  it("should return 500 and default error message if no status or message is provided", async () => {
    app.get("/server-error", (req, res, next) => {
      const error = new Error();
      next(error);
    });

    const response = await request(app).get("/server-error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        message: "Internal Server Error",
      },
    });
  });
});

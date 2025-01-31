const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Task = require("../../models/Task"); // Adjust path if needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Task Model Tests", () => {
  it("should create and save a task successfully", async () => {
    const validTask = new Task({
      title: "Test Task",
      description: "This is a test task",
      status: "Pending",
      user: new mongoose.Types.ObjectId(),
    });

    const savedTask = await validTask.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe("Test Task");
    expect(savedTask.description).toBe("This is a test task");
    expect(savedTask.status).toBe("Pending");
    expect(savedTask.user).toBeDefined();
  });

  it('should default status to "Pending" if not provided', async () => {
    const taskWithoutStatus = new Task({
      title: "Task without status",
      user: new mongoose.Types.ObjectId(),
    });

    const savedTask = await taskWithoutStatus.save();

    expect(savedTask.status).toBe("Pending");
  });

  it("should not save a task without a required field (title)", async () => {
    const taskWithoutTitle = new Task({
      user: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await taskWithoutTitle.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it("should enforce enum values for status", async () => {
    const invalidTask = new Task({
      title: "Invalid Status Task",
      status: "Invalid Status",
      user: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await invalidTask.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.status).toBeDefined();
  });

  it("should default description to null if not provided", async () => {
    const taskWithoutDescription = new Task({
      title: "Task without description",
      user: new mongoose.Types.ObjectId(),
    });

    const savedTask = await taskWithoutDescription.save();

    expect(savedTask.description).toBeNull();
  });

  it("should set created_at automatically", async () => {
    const task = new Task({
      title: "Task with created_at",
      user: new mongoose.Types.ObjectId(),
    });

    const savedTask = await task.save();

    expect(savedTask.created_at).toBeDefined();
    expect(savedTask.created_at).toBeInstanceOf(Date);
  });

  it("should allow updating the updated_at field", async () => {
    const task = new Task({
      title: "Task to update",
      user: new mongoose.Types.ObjectId(),
    });

    const savedTask = await task.save();
    savedTask.updated_at = new Date();

    const updatedTask = await savedTask.save();
    expect(updatedTask.updated_at).toBeInstanceOf(Date);
  });
});

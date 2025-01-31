const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const User = require("../../models/User"); // Adjust path as necessary

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

describe("User Model Tests", () => {
  it("should create and save a user successfully", async () => {
    const validUser = new User({
      username: "testuser",
      password: "TestPassword123",
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.password).not.toBe("TestPassword123"); // Password should be hashed
  });

  it("should hash the password before saving", async () => {
    const user = new User({
      username: "userWithPassword",
      password: "Password123",
    });

    const savedUser = await user.save();

    const isPasswordHashed = await bcrypt.compare(
      "Password123",
      savedUser.password
    );
    expect(isPasswordHashed).toBe(true);
  });

  it("should throw an error when username is not provided", async () => {
    const userWithoutUsername = new User({
      password: "Password123",
    });

    let err;
    try {
      await userWithoutUsername.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.username).toBeDefined();
  });

  it("should throw an error when password is not provided", async () => {
    const userWithoutPassword = new User({
      username: "userWithoutPassword",
    });

    let err;
    try {
      await userWithoutPassword.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should compare passwords correctly", async () => {
    const user = new User({
      username: "testuser2",
      password: "Password123",
    });

    const savedUser = await user.save();

    const isMatch = await savedUser.comparePassword("Password123");
    expect(isMatch).toBe(true);

    const isNotMatch = await savedUser.comparePassword("WrongPassword");
    expect(isNotMatch).toBe(false);
  });

  it("should not save duplicate usernames", async () => {
    const user1 = new User({
      username: "duplicateUser",
      password: "Password123",
    });

    await user1.save();

    const user2 = new User({
      username: "duplicateUser",
      password: "Password456",
    });

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code for MongoDB
  });
});

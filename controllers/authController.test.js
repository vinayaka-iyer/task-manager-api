const { register, login } = require('./authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../models/User'); // Mock the User model
jest.mock('jsonwebtoken'); // Mock the jwt library

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('register', () => {
    it('should return 400 if username or password is missing', async () => {
      const req = { body: { username: '', password: '' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username and Password is required',
      });
    });

    it('should return 400 if the username already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'testuser' });

      const req = { body: { username: 'testuser', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username already exists',
        user: 'testuser',
      });
    });

    it('should return 201 on successful registration', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue();

      const req = { body: { username: 'newuser', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'newuser' });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User resgisted successfully.',
      });
    });
  });

  describe('login', () => {
    it('should return 400 if username or password is missing', async () => {
      const req = { body: { username: '', password: '' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username and Password is required',
      });
    });

    it('should return 400 for invalid username', async () => {
      User.findOne.mockResolvedValue(null);

      const req = { body: { username: 'invaliduser', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'invaliduser' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid username or password',
      });
    });

    it('should return 400 for incorrect password', async () => {
      const mockUser = {
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      const req = { body: { username: 'testuser', password: 'wrongpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid username or password',
      });
    });

    it('should return 200 and a token for valid credentials', async () => {
      const mockUser = {
        _id: 'userId123',
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockToken');

      const req = { body: { username: 'testuser', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'userId123', username: 'testuser' },
        'my_jwt_secret',
        { expiresIn: '30d' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockToken',
      });
    });
  });
});
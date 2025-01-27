/*
Summary of Jest Functions
| Function                        | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| jest.mock()                   | Mocks a module or dependency.                                             |
| jest.fn()                     | Creates a mock function to track calls and arguments.                     |
| mockReturnThis()              | Allows chaining by returning the mocked function itself.                  |
| mockResolvedValue(value)      | Simulates an async function returning a resolved promise.                 |
| mockRejectedValue(error)      | Simulates an async function returning a rejected promise (throws error).  |
| toHaveBeenCalled()            | Asserts that a mocked function was called.                                |
| toHaveBeenCalledWith(args)    | Asserts that a mocked function was called with specific arguments.        |
| jest.clearAllMocks()          | Resets call history of all mocked functions before each test.             |
*/

const { getTasks } = require('./taskController'); // Adjust path
const Task = require('../models/Task'); // Adjust path

jest.mock('../models/Task'); // Mock the Task model

describe('Task Controller', () => {
    let req, res;

beforeEach(() => {
  req = {
    user: { id: 'mockUserId' }, // Mock authenticated user ID
    query: { page: '1', limit: '10' }, // Mock query params for pagination
  };

  res = {
    status: jest.fn().mockReturnThis(), // Mock Express response's status method
    json: jest.fn(), // Mock response's json method
  };

  jest.clearAllMocks(); // Clear previous mock calls before each test
});

    describe('get all tasks', () => {
        it('should return tasks with pagination information', async () => {
            // Mock Task.find to return a query-like object with skip and limit methods
            const mockFind = {
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockResolvedValue([
                { id: 1, name: 'Task 1' },
                { id: 2, name: 'Task 2' },
              ]),
            };
            Task.find.mockReturnValue(mockFind); // Mock Task.find to return the query object
          
            Task.countDocuments.mockResolvedValue(30); // Mock total tasks
          
            await getTasks(req, res);
          
            // Verify countDocuments was called correctly
            expect(Task.countDocuments).toHaveBeenCalledWith({ user: 'mockUserId' });
          
            // Verify find was called with the correct filter
            expect(Task.find).toHaveBeenCalledWith({ user: 'mockUserId' });
          
            // Verify skip and limit methods were called with the correct values
            expect(mockFind.skip).toHaveBeenCalledWith(0); // skip = (page - 1) * limit
            expect(mockFind.limit).toHaveBeenCalledWith(10); // limit = 10
          
            // Verify the response
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
              page: 1,
              limit: 10,
              total: 30,
              pages: 3,
              tasks: [
                { id: 1, name: 'Task 1' },
                { id: 2, name: 'Task 2' },
              ],
            });
          });
        
          it('should handle errors and respond with status 500', async () => {
            // Mock Task.countDocuments to throw an error
            Task.countDocuments.mockRejectedValue(new Error('Database error'));
        
            await getTasks(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
              message: 'Database error',
            });
          })
        })
    })

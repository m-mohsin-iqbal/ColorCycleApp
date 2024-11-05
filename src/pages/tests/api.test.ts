import { createMocks } from 'node-mocks-http';
import signupHandler from '../api/signup';
import loginHandler from '../api/login';
import colorsHandler from '../api/colors';
jest.mock('../lib/db', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('../models/User', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../models/ColorState', () => ({
  ColorState: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(() => true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn((token, secret, callback) => callback(null, { userId: '6729ffe06a6c3d9cac02d2d8' })),
}));

describe('API Routes', () => {
  test('POST /api/signup', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await signupHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({ message: 'User created successfully' });
  });

  test('POST /api/login', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ token: 'token' });
  });

  test('POST /api/colors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer token',
      },
      body: {
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
        highlightIndex: 2,
      },
    });

    await colorsHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Color state logged successfully' });
  });

  test('GET /api/colors', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer token',
      },
    });

    await colorsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
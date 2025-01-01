// test/userService.test.js
const userService = require('../service/userService');
const userRepo = require('../repository/userRepo');
const FarmerDetails = require('../models/FarmerDetails');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../repository/userRepo');
jest.mock('../models/FarmerDetails');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@test.com'
      };

      userRepo.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      userRepo.createUser.mockResolvedValue(mockUser);

      const result = await userService.registerUser('testuser', 'test@test.com', 'password123');

      expect(result).toEqual({
        success: true,
        data: { id: 1, username: 'testuser', email: 'test@test.com' },
        message: 'User created successfully'
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should return error for existing user', async () => {
      userRepo.findUserByEmail.mockResolvedValue({ id: 1 });

      const result = await userService.registerUser('testuser', 'test@test.com', 'password123');

      expect(result).toEqual({
        success: false,
        statusCode: 400,
        message: 'User already exists'
      });
    });
  });

  describe('loginUser', () => {
    it('should successfully login user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
        password_hash: 'hashedPassword'
      };

      const mockFarmer = {
        age: 30,
        vision_problems: false,
        color_blindness: false
      };

      userRepo.findUserByEmail.mockResolvedValue(mockUser);
      FarmerDetails.findOne.mockResolvedValue(mockFarmer);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      const result = await userService.loginUser('test@test.com', 'password123');

      expect(result).toEqual({
        success: true,
        data: { token: 'mockToken' },
        message: 'Login successful'
      });
    });

    it('should return error for non-existent user', async () => {
      userRepo.findUserByEmail.mockResolvedValue(null);

      const result = await userService.loginUser('test@test.com', 'password123');

      expect(result).toEqual({
        success: false,
        statusCode: 404,
        message: 'User not found'
      });
    });

    it('should return error for invalid password', async () => {
      userRepo.findUserByEmail.mockResolvedValue({
        id: 1,
        password_hash: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(false);

      const result = await userService.loginUser('test@test.com', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        statusCode: 400,
        message: 'Invalid password'
      });
    });
  });

  describe('registerFarmer', () => {
    it('should successfully register a farmer with preferences', async () => {
      const mockUser = {
        id: 1,
        username: 'farmer',
        email: 'farmer@test.com'
      };

      userRepo.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      userRepo.createUser.mockResolvedValue(mockUser);
      userRepo.createFarmerDetails.mockResolvedValue({});
      userRepo.createAccessibilitySettings.mockResolvedValue({});

      const result = await userService.registerFarmer(
        'farmer',
        'farmer@test.com',
        'password123',
        30,
        false,
        false,
        'medium',
        'standard',
        true,
        true
      );

      expect(result).toEqual({
        success: true,
        data: { id: 1, username: 'farmer', email: 'farmer@test.com' },
        message: 'Farmer registered successfully'
      });
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      const mockPreferences = {
        text_size: 'large',
        layout: 'compact',
        color_friendly_scheme: true,
        use_symbols_with_colors: true
      };

      userRepo.getUserPreferences.mockResolvedValue(mockPreferences);

      const result = await userService.getUserPreferences(1);

      expect(result).toEqual({
        success: true,
        data: mockPreferences,
        message: 'Preferences fetched successfully'
      });
    });

    it('should handle non-existent preferences', async () => {
      userRepo.getUserPreferences.mockResolvedValue(null);

      const result = await userService.getUserPreferences(1);

      expect(result).toEqual({
        success: false,
        statusCode: 404,
        message: 'Preferences not found'
      });
    });
  });
});
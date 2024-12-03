// test/rewardService.test.js
const rewardService = require('../service/rewardService');
const rewardRepo = require('../repository/rewardRepo');

// Mock the repository layer
jest.mock('../repository/rewardRepo');
// Mock the logger to avoid console noise during tests
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('Reward Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getUserPoints', () => {
    it('should return user points when user exists', async () => {
      const mockUserPoints = {
        user_id: 1,
        total_points: 150
      };
      rewardRepo.getUserPoints.mockResolvedValue(mockUserPoints);

      const result = await rewardService.getUserPoints(1);
      expect(result).toBe(150);
      expect(rewardRepo.getUserPoints).toHaveBeenCalledWith(1);
    });

    it('should return 0 when user does not exist', async () => {
      rewardRepo.getUserPoints.mockResolvedValue(null);

      const result = await rewardService.getUserPoints(1);
      expect(result).toBe(0);
      expect(rewardRepo.getUserPoints).toHaveBeenCalledWith(1);
    });
  });

  describe('getActivityHistory', () => {
    it('should return activity history for user', async () => {
      const mockHistory = [
        { activity_type: 'Points Added', points_earned: 100 },
        { activity_type: 'Reward Redemption', points_earned: -50 }
      ];
      rewardRepo.getActivityHistory.mockResolvedValue(mockHistory);

      const result = await rewardService.getActivityHistory(1);
      expect(result).toEqual(mockHistory);
      expect(rewardRepo.getActivityHistory).toHaveBeenCalledWith(1);
    });
  });

  describe('redeemPoints', () => {
    it('should successfully redeem points when user has sufficient balance', async () => {
      const mockUserPoints = {
        user_id: 1,
        total_points: 600
      };
      rewardRepo.getUserPoints.mockResolvedValue(mockUserPoints);
      rewardRepo.deductPoints.mockResolvedValue();
      rewardRepo.addActivityHistory.mockResolvedValue();

      const result = await rewardService.redeemPoints(1, 'consultation');
      
      expect(result).toEqual({
        success: true,
        message: 'Redeemed consultation reward'
      });
      expect(rewardRepo.deductPoints).toHaveBeenCalledWith(1, 500);
      expect(rewardRepo.addActivityHistory).toHaveBeenCalledWith(
        1,
        'Reward Redemption',
        -500,
        'Redeemed consultation reward'
      );
    });

    it('should return insufficient points error when balance is low', async () => {
      const mockUserPoints = {
        user_id: 1,
        total_points: 50
      };
      rewardRepo.getUserPoints.mockResolvedValue(mockUserPoints);

      const result = await rewardService.redeemPoints(1, 'market_insight');
      
      expect(result).toEqual({
        success: false,
        message: 'Insufficient points'
      });
      expect(rewardRepo.deductPoints).not.toHaveBeenCalled();
      expect(rewardRepo.addActivityHistory).not.toHaveBeenCalled();
    });

    it('should handle non-existent user', async () => {
      rewardRepo.getUserPoints.mockResolvedValue(null);

      const result = await rewardService.redeemPoints(1, 'market_insight');
      
      expect(result).toEqual({
        success: false,
        message: 'Insufficient points'
      });
    });
  });

  describe('addPoints', () => {
    // todo
    // it('should create new points entry for new user', async () => {
    //   rewardRepo.getUserPoints.mockResolvedValue(null);
    //   rewardRepo.createUserPoints.mockResolvedValue();
    //   rewardRepo.addActivityHistory.mockResolvedValue();

    //   const result = await rewardService.addPoints(1, 100);
      
    //   expect(rewardRepo.createUserPoints).toHaveBeenCalledWith(1, 100);
    //   expect(rewardRepo.addActivityHistory).toHaveBeenCalledWith(
    //     1,
    //     'Points Added',
    //     100,
    //     'Added 100 points'
    //   );
    // });

    it('should update points for existing user', async () => {
      const mockUserPoints = {
        user_id: 1,
        total_points: 100,
        save: jest.fn().mockResolvedValue()
      };
      rewardRepo.getUserPoints.mockResolvedValue(mockUserPoints);
      rewardRepo.addActivityHistory.mockResolvedValue();

      const result = await rewardService.addPoints(1, 50);
      
      expect(mockUserPoints.save).toHaveBeenCalled();
      expect(mockUserPoints.total_points).toBe(150);
      expect(rewardRepo.addActivityHistory).toHaveBeenCalledWith(
        1,
        'Points Added',
        50,
        'Added 50 points'
      );
    });
  });

  describe('updatePoints', () => {
    it('should successfully update points', async () => {
      const mockUserPoints = {
        user_id: 1,
        total_points: 100,
        save: jest.fn().mockResolvedValue()
      };
      rewardRepo.getUserPoints.mockResolvedValue(mockUserPoints);
      rewardRepo.addActivityHistory.mockResolvedValue();

      const result = await rewardService.updatePoints(1, 200);
      
      expect(result).toEqual({
        success: true,
        message: 'Points updated to 200'
      });
      expect(mockUserPoints.save).toHaveBeenCalled();
      expect(mockUserPoints.total_points).toBe(200);
      expect(rewardRepo.addActivityHistory).toHaveBeenCalledWith(
        1,
        'Points Updated',
        100,
        'Updated points to 200'
      );
    });

    it('should handle non-existent user', async () => {
      rewardRepo.getUserPoints.mockResolvedValue(null);

      const result = await rewardService.updatePoints(1, 200);
      
      expect(result).toEqual({
        success: false,
        message: 'User points not found'
      });
      expect(rewardRepo.addActivityHistory).not.toHaveBeenCalled();
    });
  });

  describe('addFarmingDataReward', () => {
    it('should add farming data reward points', async () => {
      const mockUserPoints = {
        user_id: 1,
        total_points: 0,
        save: jest.fn().mockResolvedValue()
      };
      rewardRepo.getUserPoints.mockResolvedValue(mockUserPoints);
      rewardRepo.addActivityHistory.mockResolvedValue();

      const result = await rewardService.addFarmingDataReward(1);
      
      expect(mockUserPoints.total_points).toBe(500); // Farming data reward is 100 points
      expect(rewardRepo.addActivityHistory).toHaveBeenCalledWith(
        1,
        'Points Added',
        500,
        'Added 100 points'
      );
    });
  });
});
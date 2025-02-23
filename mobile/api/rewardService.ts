import apiClient, { ApiResponse } from './apiClient';



/**
 * Get the user's reward points.
 * @returns {Promise<number>} - The user's reward points.
 */
export const useGetRewardPoints = async (): Promise<number> => {
  try {
    const response: ApiResponse<{ points: number }> = await apiClient.get('/rewards-service/points');
    return response.data.points;
  } catch (error) {
    console.error('Error fetching reward points:', error);
    throw error;
  }
};
//{{API}}/rewards-service-settings/
/**
 * Get the reward settings.
 * @returns {Promise<Array<any>>} - The reward settings.
 */
export const useGetRewardSettings = async (): Promise<Array<any>> => {
  try {
    const response: ApiResponse<Array<any>> = await apiClient.get('/rewards-service-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching reward settings:', error);
    throw error;
  }
};

// {{API}}/farming-service/nearby-farmers?lat=6.994585&long=800.724331&radius=1

/**
 * Get the nearby farmers.
 * @param {number} lat - The latitude.
 * @param {number} long - The longitude.
 * @param {number} radius - The radius.
 * @returns {Promise<Array<any>>} - The nearby farmers.
 */
export const useGetNearbyFarmers = async (lat: number, long: number, radius: number): Promise<Array<any>> => {
  try {
    const response: ApiResponse<Array<any>> = await apiClient.get(`/farming-service/nearby-farmers?lat=${lat}&long=${long}&radius=${radius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby farmers:', error);
    throw error;
  }
}

/**
 * Get the user's reward activity history.
 * @returns {Promise<Array<any>>} - The user's reward activity history.
 */
export const useGetRewardActivityHistory = async (): Promise<Array<any>> => {
  try {
    const response: ApiResponse<Array<any>> = await apiClient.get('/rewards-service/activity-history');
    return response.data;
  } catch (error) {
    console.error('Error fetching reward activity history:', error);
    throw error;
  }
};

interface FarmingData {
  farmer_ref: string;
  farmer_name: string;
  lat: number;
  long: number;
  vegetable_ref: string;
  vegetable_name: string;
  amount: number;
  planted_at: string;
}

/**
 * Submit farming data.
 * @param {FarmingData} farmingData - The farming data to submit.
 * @returns {Promise<void>} - A promise indicating the submission status.
 */
export const usePostFarmingData = async (farmingData: FarmingData): Promise<void> => {
  try {
    await apiClient.post('/farming-service/farming-data', farmingData);
    console.log('Farming data submitted successfully.');
  } catch (error) {
    console.error('Error submitting farming data:', error);
    throw error;
  }
};


interface RedeemRewardData {
    rewardType: string;
  }
  
  /**
   * Redeem a reward.
   * @param {RedeemRewardData} rewardData - The reward type to redeem.
   * @returns {Promise<void>} - A promise indicating the submission status.
   */
  export const usePostRedeemReward = async (rewardData: RedeemRewardData): Promise<void> => {
    try {
      await apiClient.post('/rewards-service/redeem', rewardData);
      console.log('Reward redeemed successfully.');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  };

  /**
   * Get the farming leaderboard.
   * @returns {Promise<Array<any>>} - The farming leaderboard.
   * 
   */

  export const useGetFarmingLeaderboard = async (): Promise<any> => { 
    try {
      const response = await apiClient.get(`/farming-service/leaderboard`);
      return response;
    } catch (error) {
      console.error('Error fetching farming leaderboard:', error);
      throw error;
    }
  }
  
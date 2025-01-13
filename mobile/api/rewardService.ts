import apiClient, { ApiResponse } from './apiClientReward';



/**
 * Get the user's reward points.
 * @returns {Promise<number>} - The user's reward points.
 */
export const useGetRewardPoints = async (): Promise<number> => {
  try {
    const response: ApiResponse<{ points: number }> = await apiClient.get('/rewards/points');
    return response.data.points;
  } catch (error) {
    console.error('Error fetching reward points:', error);
    throw error;
  }
};

/**
 * Get the user's reward activity history.
 * @returns {Promise<Array<any>>} - The user's reward activity history.
 */
export const useGetRewardActivityHistory = async (): Promise<Array<any>> => {
  try {
    const response: ApiResponse<Array<any>> = await apiClient.get('/rewards/activity-history');
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
    await apiClient.post('/farming/farming-data', farmingData);
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
      await apiClient.post('/rewards/redeem', rewardData);
      console.log('Reward redeemed successfully.');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  };
  
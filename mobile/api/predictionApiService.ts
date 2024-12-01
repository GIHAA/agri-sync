import apiClient, { ApiResponse } from './apiClientPrediction';

/**
 * Fetch the predicted price for a vegetable.
 * @param {string} whenToPlant - The planting time.
 * @param {string} whatToPlant - The vegetable to plant.
 * @returns {Promise<number>} - Predicted price.
 */
export const fetchPredictedPrice = async (
  whenToPlant: string,
  whatToPlant: string
): Promise<number> => {
  try {
    const response: ApiResponse<{ predicted_price : number}> = await apiClient.post('/predict', {
      whenToPlant,
      whatToPlant: whatToPlant.toUpperCase(),
    });

    return response.data.predicted_price;
  } catch (error) {
    console.error('Error fetching predicted price:', error);
    throw error;
  }
};

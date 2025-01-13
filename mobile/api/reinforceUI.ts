import apiClient from "./apiClientRein";

export const trackInteraction = async (buttonClicks: number) => {
  try {
    const response = await apiClient.post(`track-interaction`, {
      buttonClicks,
    });
    return response.data; // Contains the action and exploration rate
  } catch (error) {
    console.error("Error tracking interaction:", error);
  }
};

export const getUiRecommendation = async () => {
  try {
    const response = await apiClient.get(`/get-ui-recommendation`);
    console.log("UI recommendation response:", response);
    return response.data; // Contains the action (UI recommendation)
  } catch (error) {
    console.error("Error fetching UI recommendation:", error);
  }
};

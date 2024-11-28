import axios from 'axios';

const API_URL = 'http://192.168.8.165:5000'; 

export const trackInteraction = async (buttonClicks: number) => {
  try {
    const response = await axios.post(`${API_URL}/track-interaction`, {
      buttonClicks
    });
    return response.data; // Contains the action and exploration rate
  } catch (error) {
    console.error("Error tracking interaction:", error);
  }
};

export const getUiRecommendation = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-ui-recommendation`);
    return response.data; // Contains the action (UI recommendation)
  } catch (error) {
    console.error("Error fetching UI recommendation:", error);
  }
};

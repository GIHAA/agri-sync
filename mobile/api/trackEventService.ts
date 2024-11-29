import axios from "axios";
import apiClient from "./apiClientRein";



export interface InteractionData {
  user_id: string;
  button_id: string;
  click_coordinates: {
    x: number;
    y: number;
  };
  missed_click_distance: number;
  is_miss_click: boolean;
  session_duration: number;
  device: string;
  timestamp: string;
}



export const trackInteraction = async (data: InteractionData) => {
  console.log("Tracking interaction:", data);
  try {
    const response = await apiClient.post(`track_interaction`, data);
    return response.data; 
  } catch (error) {
    console.error("Error tracking interaction:", error);
  }
};



// // Function to track interaction and send to MongoDB
// export async function trackInteraction(data: InteractionData) {

//   console.log('Tracking interaction:', data);
//   try {
//     // Replace with your actual MongoDB backend endpoint
//     const response = await axios.post('http://127.0.0.1:8000', data, {
//       headers: {
//         'Content-Type': 'application/json',
//         // Add any authentication headers if required
//         // 'Authorization': `Bearer ${yourAuthToken}`
//       }
//     });

//     // Optional: Log successful tracking
//     if (data.is_miss_click) {
//       console.log('Miss-click tracked', response.data);
//     } else {
//       console.log('Button interaction tracked', response.data);
//     }

//     return response.data;
//   } catch (error) {
//     // Log and handle any errors during tracking
//     console.error('Failed to track interaction', error);
    
//     // Optionally, you might want to send to a backup logging service
//     // or implement retry logic
//     throw error;
  
//   }

// }
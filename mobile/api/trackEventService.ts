import axios from "axios";



export interface InteractionData {
  userID: number;
  buttonId: string;
  touchPoint: {
    x: number;
    y: number;
  };
  isMissClick: boolean;
  deviceMetrics: {
    screenWidth: number;
    screenHeight: number;
    deviceOrientation : string;
  };  
  timestamp: string;
}



export const trackInteraction = async (data: InteractionData) => {
  console.log("Tracking interaction:", data);
  try {
   // const response = await apiClient.post(`track_interaction`, data);
    return { success: true, message: "Interaction tracked successfully" }; 
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
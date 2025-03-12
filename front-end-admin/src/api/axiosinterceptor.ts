import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Hard-coded base URL
const BASE_URL = "http://localhost:3000"; // Replace with your actual backend URL

const authFetch = axios.create({
  baseURL: BASE_URL, // Use the hard-coded base URL
  headers: {
    "Content-Type": "application/json",
  },

});

authFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Clear all related localStorage items if the token is expired
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("validationToken");
        localStorage.removeItem("notification_token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("selectedCurrency");

        // Reload the page to redirect the user to the login screen
        window.location.reload();

        // Cancel the request since the token is expired
        throw new axios.Cancel("Token expired");
      }
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authFetch;
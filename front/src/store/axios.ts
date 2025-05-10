import Axios from "axios";

// Set the base URL for all axios requests
const axios = Axios.create({
  baseURL: "http://localhost:5000/api/v1", // Base URL for the API
  withCredentials: true, // Include credentials (cookies) in requests
  // Set default headers
  headers: {
    "Content-Type": "application/json", // Set the content type for requests
    Accept: "application/json",
  },
});

// Set default headers
export default axios;

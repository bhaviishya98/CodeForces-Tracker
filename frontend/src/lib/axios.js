// src/lib/axios.js or anywhere you prefer
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Change to your backend's URL
});

export default instance;

import axios from "axios";

// Use environment variable for flexibility between local and production
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default instance;

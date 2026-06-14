

// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically add token to headers
API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

export default API;
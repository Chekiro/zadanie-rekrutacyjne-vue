import axios from "axios";

const weatherApiOptions = {
  baseURL: "https://api.openweathermap.org/data/2.5",
  headers: {
    "Content-Type": "application/json",
  },
};

export const weatherApiInstance = axios.create(weatherApiOptions);

weatherApiInstance.interceptors.request.use((config) => {
  config.params.appid = import.meta.env.VITE_API_KEY;
  return config;
});

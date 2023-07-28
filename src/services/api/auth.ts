import axios from "axios";
import Config from "react-native-config";

const API_URL = Config.API_URL;

export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const loginUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

import axios from "axios";
import config from 'react-native-config'

const API_URL = config.API_URL

export const registerUser = async (userData: any) => {
  console.log(API_URL)
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

export const loginUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

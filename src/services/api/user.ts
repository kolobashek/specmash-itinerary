import axios from 'axios'

const API_URL = 'https://example.com/api'

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData)
  return response.data
}

export const loginUser = async (userData) => {
  // ...
}

export const getUsers = async () => {
  // ...
}

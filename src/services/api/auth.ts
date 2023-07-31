import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL; 

interface UserData {
  name: string;
  phone: string;
  password: string;
  role: string;
}

interface ResponseData {
  id: string;
  token: string;
}

export const registerUser = async (userData: UserData): Promise<ResponseData> => {

  // Валидация
  if(!userData.name || !userData.phone || !userData.password) {
    throw new Error('Не заполнены обязательные поля');
  }

  try {
    console.log(`${API_URL}/register`);
    const response = await axios.post<ResponseData>(`${API_URL}/register`, userData);
    console.log(response)
    return response.data;

  } catch (error: any) {
    // Обработка ошибки
    throw new Error(error.message); 
  }

}

export const loginUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

import axios from "axios";
import Store from '../../store'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../../App'

const API_URL = process.env.EXPO_PUBLIC_API_URL

interface UserData {
  name: string
  phone: string
  password: string
  role: string
}

interface ResponseData {
  message: string
}

export const registerUser = async (
  userData: UserData
): Promise<ResponseData> => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  // Валидация
  if (!userData.name || !userData.phone || !userData.password) {
    throw new Error('Не заполнены обязательные поля')
  }

  try {
    const response = await axios.post<ResponseData>(
      `${API_URL}/register`,
      userData
    )

    if (response.status === 201) {
      // Успешная регистрация
      Store.setRegistrationMessage(response.data.message)
      Store.setUserAuthorized(true)
      navigation.navigate('InfoScreen')
    }

    return response.data
  } catch (error: any) {
    // Обработка ошибки
    throw new Error(error.message)
  }
}

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData)
    return response.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const checkIsActive = async () => {
  const response = await axios.post(`${API_URL}/graphql?query MyQuery {
  isActive(userId: "")
}`)
  return response.data
}

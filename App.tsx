import React from "react";
import { observer } from "mobx-react-lite";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import store from "./src/store";
import {
  RegisterScreen,
  LoginScreen,
  TableScreen,
  InfoScreen,
} from './src/components'

const Stack = createStackNavigator<RootStackParamList>()
const REGISTER_SCREEN = 'Register'
const LOGIN_SCREEN = 'Login'
const INFO_SCREEN = 'Info'

export interface RootStackParamList {
  Home: undefined
  Profile: { userId: string }

  [key: string]: undefined | { userId: string }
}

type NavigationProps = StackNavigationProp<RootStackParamList>
// Проверяем авторизацию пользователя
const isAuthorized = store.getUserAuthorized()

const App = observer(() => {
  // Если пользователь авторизован, рендерим экран таблицы
  if (isAuthorized) {
    return <TableScreen />
  }
  // Иначе рендерим экраны регистрации и авторизации
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
        <Stack.Screen name={REGISTER_SCREEN} component={RegisterScreen} />
        <Stack.Screen name={INFO_SCREEN} component={InfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})

export default App;

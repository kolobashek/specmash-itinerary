import * as React from "react";
import { observer } from "mobx-react-lite";
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import store from './src/store'
import {
  RegisterScreen,
  LoginScreen,
  TableScreen,
  InfoScreen,
  ContragentsScreen,
} from './src/components'

const Stack = createNativeStackNavigator<RootStackParamList>()
const REGISTER_SCREEN = 'Register'
const LOGIN_SCREEN = 'Login'
const INFO_SCREEN = 'Info'
const CONTRAGENTS_SCREEN = 'Contragents'

export interface RootStackParamList {
  Home: undefined
  Profile: { userId: string }

  [key: string]: undefined | { userId: string }
}

// type NavigationProps = StackNavigationProp<RootStackParamList>
// Проверяем авторизацию пользователя
const isAuthorized = store.getUserAuthorized()

const App = observer(() => {
  // Если пользователь авторизован, рендерим экран таблицы
  if (isAuthorized) {
    return <TableScreen />
  }
  // Иначе рендерим экраны регистрации и авторизации
  return (
    <SafeAreaProvider>
      <Router>
        <BrowserRouter>
          <Stack.Navigator>
            <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
            <Stack.Screen name={REGISTER_SCREEN} component={RegisterScreen} />
            <Stack.Screen name={INFO_SCREEN} component={InfoScreen} />
            <Stack.Screen name={CONTRAGENTS_SCREEN} component={ContragentsScreen} />
          </Stack.Navigator>
        </BrowserRouter>
      </Router>
    </SafeAreaProvider>
  )
})

export default App;

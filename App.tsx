import React, { useEffect, useState } from 'react'
// import { StatusBar } from 'expo-status-bar'
import { observer } from 'mobx-react-lite'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import store from './src/store'
import {
	RegisterScreen,
	LoginScreen,
	TableScreen,
	InfoScreen,
	ContragentsScreen,
} from './src/components'

const Stack = createStackNavigator<RootStackParamList>()
const REGISTER_SCREEN = 'Register'
const LOGIN_SCREEN = 'Login'
const INFO_SCREEN = 'Info'
const CONTRAGENTS_SCREEN = 'Contragents'
const TABLE_SCREEN = 'Table'

// Проверяем авторизацию пользователя
const Screens = ({ isAuthorized }: { isAuthorized: boolean }) => {
	if (!isAuthorized)
		return (
			<Stack.Navigator>
				<Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
				<Stack.Screen name={REGISTER_SCREEN} component={RegisterScreen} />
			</Stack.Navigator>
		)
	return (
		<Stack.Navigator>
			<Stack.Screen name={TABLE_SCREEN} component={TableScreen} options={{ headerShown: false }} />
			<Stack.Screen name={INFO_SCREEN} component={InfoScreen} />
			<Stack.Screen name={CONTRAGENTS_SCREEN} component={ContragentsScreen} />
		</Stack.Navigator>
	)
}

const App = observer(() => {
	useEffect(() => {
		const checkAuth = async () => {
			const token = await store.auth.getTokenFromAsyncStorage()
			if (token) {
				store.auth.setUserAuthorized(true)
			}
		}
		checkAuth()
	}, [store.auth.userAuthorized])

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Screens isAuthorized={store.auth.userAuthorized} />
			</NavigationContainer>
		</SafeAreaProvider>
	)
})

export default App

export interface RootStackParamList {
	Home: undefined
	Profile: { userId: string }

	[key: string]: undefined | { userId: string }
}

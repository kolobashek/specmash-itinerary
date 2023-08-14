import React, { useEffect, useState } from 'react'
// import { StatusBar } from 'expo-status-bar'
import { observer } from 'mobx-react-lite'
import { NavigationContainer } from '@react-navigation/native'
// import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import store from './src/store'
import {
	RegisterScreen,
	LoginScreen,
	TableScreen,
	InfoScreen,
	ContragentsScreen,
} from './src/components'
import { GraphQLClient, ClientContext, useQuery, useManualQuery } from 'graphql-hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Queries from './src/services/api/queries'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const url = API_URL + '/graphql'

const client = new GraphQLClient({
	url,
})

const Stack = createStackNavigator<RootStackParamList>()
const REGISTER_SCREEN = 'Register'
const LOGIN_SCREEN = 'Login'
const INFO_SCREEN = 'Info'
const CONTRAGENTS_SCREEN = 'Contragents'
const TABLE_SCREEN = 'Table'

export interface RootStackParamList {
	Home: undefined
	Profile: { userId: string }

	[key: string]: undefined | { userId: string }
}

// type NavigationProps = StackNavigationProp<RootStackParamList>
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
	const [Me, { error }] = useManualQuery(Queries.me, { client })
	const getToken = async () => {
		const result = await AsyncStorage.getItem('token')
		return result
	}

	useEffect(() => {
		const checkAuth = async () => {
			const token = await getToken()
			if (token) {
				client.setHeader('authorization', token)
				const { data } = await Me()
				store.setUserAuthorized(true)
				if (!error && data.me) {
					store.setUserData(data.me)
				}
			}
		}
		checkAuth()
	}, [store.userAuthorized])
	return (
		<ClientContext.Provider value={client}>
			<SafeAreaProvider>
				<NavigationContainer>
					<Screens isAuthorized={store.userAuthorized} />
				</NavigationContainer>
			</SafeAreaProvider>
		</ClientContext.Provider>
	)
})

export default App

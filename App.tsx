import React, { useEffect } from 'react'
// import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { observer } from 'mobx-react-lite'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import store from './src/store'
import {
	RegisterScreen,
	LoginScreen,
	TableScreen,
	InfoScreen,
	ContragentsScreen,
	MachineScreen,
} from './src/components'

const Stack = createStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator()

const REGISTER_SCREEN = 'Register'
const LOGIN_SCREEN = 'Login'
const INFO_SCREEN = 'Info'
const CONTRAGENTS_SCREEN = 'Contragents'
const TABLE_SCREEN = 'Table'
const MACHINES_SCREEN = 'Machines'

const Home = () => {
	return (
		<Drawer.Navigator initialRouteName={TABLE_SCREEN} defaultStatus={'open'}>
			<Drawer.Screen name={TABLE_SCREEN} component={TableScreen} options={{ headerShown: false }} />
			<Drawer.Screen
				name={MACHINES_SCREEN}
				component={MachineScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen name={INFO_SCREEN} component={InfoScreen} />
			<Drawer.Screen name={CONTRAGENTS_SCREEN} component={ContragentsScreen} />
		</Drawer.Navigator>
	)
}

const App = observer(() => {
	useEffect(() => {
		const checkAuth = async () => {
			const user = await store.auth.getCurrentUser()
		}
		checkAuth()
	}, [store.auth.userAuthorized])
	const isAuthorized = store.auth.userAuthorized
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator>
					{!isAuthorized ? (
						<>
							<Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
							<Stack.Screen
								name={REGISTER_SCREEN}
								component={RegisterScreen}
								options={{ headerShown: false }}
							/>
						</>
					) : (
						<Stack.Screen name='Home' component={Home} />
					)}
				</Stack.Navigator>
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

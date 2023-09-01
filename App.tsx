import React, { useEffect, useState } from 'react'
// import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import { observer } from 'mobx-react-lite'
import {
	NavigationContainer,
	LinkingOptions,
	NavigatorScreenParams,
} from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import store from './src/store'
import {
	RegisterScreen,
	LoginScreen,
	TableScreen,
	InfoScreen,
	ContragentsScreen,
	MachineScreen,
	DriversList,
} from './src/components'
import { DriverCard } from './src/components/DriversTable'
import * as Device from 'expo-device'

const Stack = createStackNavigator<RootStackParamList>()
const AuthStack = createStackNavigator<AuthStackParamList>()
const Drawer = createDrawerNavigator<HomeDrawerParamList>()
const DriversStack = createStackNavigator<DriversStackParamList>()
const prefix = Linking.createURL('/')

const REGISTER_SCREEN = 'register'
const LOGIN_SCREEN = 'login'
const INFO_SCREEN = 'info'
const CONTRAGENTS_SCREEN = 'contragents'
const SHIFTS_SCREEN = 'shifts'
const MACHINES_SCREEN = 'machines'
const DRIVERS_SCREEN = 'drivers'

const App = observer(() => {
	const url = Linking.useURL()
	let pathname = null
	if (Device.DeviceType[Device.deviceType || 0] === 'DESKTOP') {
		pathname = url && new URL(url).pathname.toLowerCase()
	}
	const [loading, setLoading] = useState(false)
	const linking: LinkingOptions<RootStackParamList> = {
		prefixes: [prefix],
		// prefixes: [Linking.createURL('/'), 'https://app.example.com'],
		config: {
			screens: {
				Спецмаш: {
					initialRouteName:
						pathname ===
						(MACHINES_SCREEN ||
							INFO_SCREEN ||
							CONTRAGENTS_SCREEN ||
							SHIFTS_SCREEN ||
							DRIVERS_SCREEN)
							? pathname
							: SHIFTS_SCREEN,
					path: '/',
					screens: {
						shifts: 'shifts',
						machines: 'machines',
						drivers: {
							path: 'drivers',
							screens: {
								DriversList: '',
								DriverDetails: {
									path: '/:id',
								},
							},
						},
						contragents: 'contragents',
						info: 'info',
					},
				},
				AuthStack: {
					path: 'auth',
					screens: {
						login: 'login',
						register: 'register',
					},
				},
			},
		},
	}
	useEffect(() => {
		setLoading(true)
		const checkAuth = async () => {
			const user = await store.auth.getCurrentUser()
			setLoading(false)
		}
		checkAuth()
	}, [store.auth.userAuthorized])
	const { userAuthorized, userRole } = store.auth
	if (loading) {
		return (
			<View style={styles.fullContainer}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		)
	}
	return (
		<SafeAreaProvider>
			<NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{!userAuthorized ? (
						<Stack.Screen name='AuthStack' component={Auth} />
					) : (
						<Stack.Screen name='Спецмаш' component={Home} />
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	)
})

const Home = observer(() => {
	const { userRole } = store.auth
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name={SHIFTS_SCREEN}
				component={TableScreen}
				options={{ drawerLabel: 'Путевые', title: 'Путевые' }}
			/>
			{(userRole === 'admin' || userRole === 'manager') && (
				<Drawer.Screen
					name={MACHINES_SCREEN}
					component={MachineScreen}
					options={{ drawerLabel: 'Техника', title: 'Техника' }}
				/>
			)}
			{(userRole === 'admin' || userRole === 'manager') && (
				<Drawer.Screen
					name={DRIVERS_SCREEN}
					component={Drivers}
					options={{ drawerLabel: 'Водители', title: 'Водители' }}
				/>
			)}
			{(userRole === 'admin' || userRole === 'manager') && (
				<Drawer.Screen
					name={CONTRAGENTS_SCREEN}
					component={ContragentsScreen}
					options={{ drawerLabel: 'Контрагенты', title: 'Контрагенты' }}
				/>
			)}
			<Drawer.Screen
				name={INFO_SCREEN}
				component={InfoScreen}
				options={{ drawerLabel: 'Info', title: 'Info' }}
			/>
		</Drawer.Navigator>
	)
})
const Auth = () => {
	return (
		<AuthStack.Navigator>
			<AuthStack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
			<AuthStack.Screen
				name={REGISTER_SCREEN}
				component={RegisterScreen}
				options={{ headerShown: false }}
			/>
		</AuthStack.Navigator>
	)
}
const Drivers = () => {
	return (
		<DriversStack.Navigator>
			<DriversStack.Screen
				name='DriversList'
				component={DriversList}
				options={{ headerShown: false }}
			/>
			<DriversStack.Screen
				name='DriverDetails'
				component={DriverCard}
				options={{ headerShown: false }}
			/>
		</DriversStack.Navigator>
	)
}

export default App

export type RootStackParamList = {
	Спецмаш: NavigatorScreenParams<HomeDrawerParamList>
	AuthStack: NavigatorScreenParams<AuthStackParamList>
}
export type HomeDrawerParamList = {
	shifts: undefined
	machines: undefined
	drivers: NavigatorScreenParams<DriversStackParamList>
	contragents: undefined
	info: undefined
}
export type DriversStackParamList = {
	DriversList: undefined
	DriverDetails: { id: string }
}
type AuthStackParamList = {
	login: undefined
	register: undefined
}

const styles = StyleSheet.create({
	fullContainer: {
		flex: 1,
		justifyContent: 'center',
	},
})

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
	DriversScreen,
} from './src/components'

const Stack = createStackNavigator<RootStackParamList>()
const AuthStack = createStackNavigator<AuthStackParamList>()
const Drawer = createDrawerNavigator<HomeDrawerParamList>()
const prefix = Linking.createURL('/')

const REGISTER_SCREEN = 'register'
const LOGIN_SCREEN = 'login'
const INFO_SCREEN = 'info'
const CONTRAGENTS_SCREEN = 'contragents'
const TABLE_SCREEN = 'table'
const MACHINES_SCREEN = 'machines'
const DRIVERS_SCREEN = 'drivers'

const App = observer(() => {
	const url = Linking.useURL()
	const pathname = url && new URL(url).pathname.toLowerCase()

	const [loading, setLoading] = useState(false)
	const linking: LinkingOptions<RootStackParamList> = {
		prefixes: [prefix],
		// prefixes: [Linking.createURL('/'), 'https://app.example.com'],
		config: {
			screens: {
				Спецмаш: {
					initialRouteName:
						pathname ===
						(MACHINES_SCREEN || INFO_SCREEN || CONTRAGENTS_SCREEN || TABLE_SCREEN || DRIVERS_SCREEN)
							? pathname
							: TABLE_SCREEN,
					path: '/',
					screens: {
						table: 'table',
						machines: 'machines',
						drivers: 'drivers',
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
	const isAuthorized = store.auth.userAuthorized
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
					{!isAuthorized ? (
						<Stack.Screen name='AuthStack' component={Auth} />
					) : (
						<Stack.Screen name='Спецмаш' component={Home} />
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	)
})

const Home = () => {
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name={TABLE_SCREEN}
				component={TableScreen}
				options={{ drawerLabel: 'Путевые' }}
			/>
			<Drawer.Screen
				name={MACHINES_SCREEN}
				component={MachineScreen}
				options={{ drawerLabel: 'Техника' }}
			/>
			<Drawer.Screen
				name={DRIVERS_SCREEN}
				component={DriversScreen}
				options={{ drawerLabel: 'Водители' }}
			/>
			<Drawer.Screen
				name={CONTRAGENTS_SCREEN}
				component={ContragentsScreen}
				options={{ drawerLabel: 'Контрагенты' }}
			/>
			<Drawer.Screen name={INFO_SCREEN} component={InfoScreen} options={{ drawerLabel: 'Info' }} />
		</Drawer.Navigator>
	)
}
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

export default App

type RootStackParamList = {
	Спецмаш: NavigatorScreenParams<HomeDrawerParamList>
	AuthStack: NavigatorScreenParams<AuthStackParamList>
}
type HomeDrawerParamList = {
	table: undefined
	machines: undefined
	drivers: undefined
	contragents: undefined
	info: undefined
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

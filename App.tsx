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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import store from './src/store'
import {
	RegisterScreen,
	LoginScreen,
	TableScreen,
	InfoScreen,
	ContrAgentsList,
	MachineScreen,
	DriversList,
	ContrAgentCard,
} from './src/components'
import { DriverCard } from './src/components/DriversScreen'
import * as Device from 'expo-device'
import { ObjectCard, ObjectsList } from './src/components/ObjectsScreen'

const Stack = createStackNavigator<RootStackParamList>()
const AuthStack = createStackNavigator<AuthStackParamList>()
const Drawer = createDrawerNavigator<HomeDrawerParamList>()
const DriversStack = createStackNavigator<DriversStackParamList>()
const ContrAgentsStack = createStackNavigator<ContrAgentsStackParamList>()
const ObjectStack = createStackNavigator<ObjectStackParamList>()
const ObjectsTab = createBottomTabNavigator<WorkPlacesTabParamList>()
const prefix = Linking.createURL('/')

// const Screen = {
// 	REGISTER_SCREEN: 'register',
// 	LOGIN_SCREEN: 'login',
// 	INFO_SCREEN: 'info',
// 	CONTRAGENTS_SCREEN: 'contragents',
// 	SHIFTS_SCREEN: 'shifts',
// 	MACHINES_SCREEN: 'machines',
// 	DRIVERS_SCREEN: 'drivers',
// 	WORK_PLACES_SCREEN: 'workplaces',
// }
const REGISTER_SCREEN = 'register'
const LOGIN_SCREEN = 'login'
const INFO_SCREEN = 'info'
const CONTRAGENTS_SCREEN = 'contragents'
const SHIFTS_SCREEN = 'shifts'
const MACHINES_SCREEN = 'machines'
const DRIVERS_SCREEN = 'drivers'
const WORK_PLACES_SCREEN = 'workplaces'
const OBJECTS_SCREEN = 'objects'
const AUTH_SCREEN = 'auth'

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
							DRIVERS_SCREEN ||
							WORK_PLACES_SCREEN)
							? pathname
							: SHIFTS_SCREEN,
					path: '/',
					screens: {
						shifts: SHIFTS_SCREEN,
						machines: MACHINES_SCREEN,
						drivers: {
							path: DRIVERS_SCREEN,
							screens: {
								DriversList: '',
								DriverDetails: {
									path: '/:id',
								},
							},
						},
						workplaces: {
							path: WORK_PLACES_SCREEN,
							screens: {
								contragents: {
									path: CONTRAGENTS_SCREEN,
									screens: {
										ContrAgentsList: '',
										ContrAgentDetails: {
											path: '/:id',
										},
									},
								},
								objects: {
									path: OBJECTS_SCREEN,
									screens: {
										ObjectsList: '',
										ObjectDetails: {
											path: '/:id',
										},
									},
								},
							},
						},
						info: 'info',
					},
				},
				AuthStack: {
					path: AUTH_SCREEN,
					screens: {
						login: LOGIN_SCREEN,
						register: REGISTER_SCREEN,
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
					name={WORK_PLACES_SCREEN}
					component={WorkPlaces}
					options={{ drawerLabel: 'Объекты', title: 'Объекты' }}
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
const ContrAgents = () => {
	return (
		<ContrAgentsStack.Navigator>
			<ContrAgentsStack.Screen
				name='ContrAgentsList'
				component={ContrAgentsList}
				options={{ headerShown: false }}
			/>
			<ContrAgentsStack.Screen
				name='ContrAgentDetails'
				component={ContrAgentCard}
				options={{ headerShown: false }}
			/>
		</ContrAgentsStack.Navigator>
	)
}
const Objects = () => {
	return (
		<ObjectStack.Navigator>
			<ObjectStack.Screen
				name='ObjectsList'
				component={ObjectsList}
				options={{ headerShown: false }}
			/>
			<ObjectStack.Screen
				name='ObjectDetails'
				component={ObjectCard}
				options={{ headerShown: false }}
			/>
		</ObjectStack.Navigator>
	)
}
const WorkPlaces = () => {
	return (
		<ObjectsTab.Navigator>
			<ObjectsTab.Screen
				name={OBJECTS_SCREEN}
				component={Objects}
				options={{ headerShown: false }}
			/>
			<ObjectsTab.Screen
				name={CONTRAGENTS_SCREEN}
				component={ContrAgents}
				options={{ headerShown: false }}
			/>
		</ObjectsTab.Navigator>
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
	workplaces: NavigatorScreenParams<WorkPlacesTabParamList>
	info: undefined
}
export type DriversStackParamList = {
	DriversList: undefined
	DriverDetails: { id: string }
}
export type ContrAgentsStackParamList = {
	ContrAgentsList: undefined
	ContrAgentDetails: { id: string }
}
export type ObjectStackParamList = {
	ObjectsList: undefined
	ObjectDetails: { id: string }
}
export type WorkPlacesTabParamList = {
	objects: NavigatorScreenParams<ObjectStackParamList>
	contragents: NavigatorScreenParams<ContrAgentsStackParamList>
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

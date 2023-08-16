import { isActive } from './../services/api/user'
import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { graphqlRequest, setAuthTokenHeader } from '../services/api/graphql'

class AuthStore {
	userAuthorized = false
	userIsActive = false
	userRole = ''
	registrationMessage = ''
	token = ''
	currentUser = {
		id: 0,
		phone: '',
		role: {
			id: 0,
			name: '',
		},
		isActive: false,
		password: '',
	}

	constructor() {
		makeAutoObservable(this)
	}

	// getTokenFromAsyncStorage = async () => {
	// 	const result = await AsyncStorage.getItem('token')
	// 	if (result) {
	// 		this.token = result
	// 		setAuthTokenHeader(result)
	// 		const currentUser = await graphqlRequest(Queries.me, {}, { token: result })
	// 		console.log(currentUser)
	// 		if (currentUser?.me) this.currentUser = currentUser.me
	// 		return result
	// 	}
	// 	return new Error('Токен не найден')
	// }

	getCurrentUser = async (): Promise<User | Error> => {
		if (this.userAuthorized) {
			return this.currentUser
		} else {
			try {
				const token = await AsyncStorage.getItem('token')
				if (!token) {
					this.userAuthorized = false
					return new Error('Токен не найден')
				} else {
					setAuthTokenHeader(token)
					const request = (await graphqlRequest(Queries.me, {}, { token })) as UserResponse
					const user = request.me
					if (user) {
						this.currentUser = user
						this.userAuthorized = true
						return user
					} else {
						this.userAuthorized = false
						return new Error('Токен не действителен')
					}
				}
			} catch (error) {
				return new Error(error as string)
			}
		}
	}

	login = async (phone: string, password: string) => {
		try {
			const { login } = (await graphqlRequest(Queries.login, {
				phone,
				password,
			})) as Login
			this.token = login.token
			await AsyncStorage.setItem('token', login.token)
			await this.getCurrentUser()
			return login.token
		} catch (error) {
			return new Error('Неверный логин или пароль')
		}
	}

	setUserAuthorized(authorized: boolean) {
		this.userAuthorized = authorized
	}

	getRegistrationMessage() {
		return this.registrationMessage
	}

	setRegistrationMessage(message: string) {
		this.registrationMessage = message
	}

	getUserIsActive() {
		return this.userIsActive
	}

	setUserData(user: any) {
		// get user data from API
		this.currentUser = user
		this.setUserRole(user.role.name)
		this.setUserActive(user.isActive)
		// set userIsActive
	}

	setUserRole(role: string) {
		this.userRole = role
	}

	setUserActive(active: boolean) {
		this.userIsActive = active
	}
}

export default new AuthStore()

interface User {
	comment?: string
	id: number
	isActive: boolean
	name?: string
	nickname?: string
	password: string
	phone: string
	role: {
		id: number
		name: string
	}
}
interface UserResponse {
	me: User
}

interface Login {
	login: {
		token: string
	}
}

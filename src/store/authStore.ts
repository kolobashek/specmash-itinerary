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
	currentUser = {}

	constructor() {
		makeAutoObservable(this)
	}

	getTokenFromAsyncStorage = async () => {
		const result = await AsyncStorage.getItem('token')
		if (result) {
			this.token = result
			const currentUser = await graphqlRequest(Queries.me, {}, { token: result })
			this.currentUser = currentUser.me
			return result
		}
		return new Error('Токен не найден')
	}

	getCurrentUser = async () => {
		if (this.currentUser) {
			return this.currentUser
		} else {
			try {
				const token = await this.getTokenFromAsyncStorage()
				if (token instanceof Error) {
					return token
				} else {
					return graphqlRequest(Queries.me, {}, { token }).then((user) => {
						this.currentUser = user.me
						return this.currentUser
					})
				}
			} catch (error) {
				return new Error(error as string)
			}
		}
	}

	login = async (phone: string, password: string) => {
		try {
			const { login } = await graphqlRequest(Queries.login, {
				phone,
				password,
			})

			await AsyncStorage.setItem('token', login.token)
			this.token = login.token
			setAuthTokenHeader(this.token)

			await this.getCurrentUser()

			this.userAuthorized = true

			return login
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

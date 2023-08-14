import { useQuery } from 'graphql-hooks'
import { makeAutoObservable } from 'mobx'

class Store {
	userAuthorized = false
	userIsActive = false
	userRole = ''
	registrationMessage = ''
	user = {}

	constructor() {
		makeAutoObservable(this)
	}

	getUserAuthorized() {
		return this.userAuthorized
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
		this.user = user
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

export default new Store()

import { request, gql } from 'graphql-request'
import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const url = API_URL + '/graphql'

class Store {
	userAuthorized = false
	userIsActive = false
	userRole = ''
	registrationMessage = ''
	user = {}
	shiftsTableFilter = {}
	shiftsTableSortBy = 'date'
	shifts = [
		{
			id: 1,
			date: '14.08.2023',
			shiftNumber: 1,
			object: 'Object 1',
			equipment: 'Car 1',
			driver: 'Ivanov I.I.',
			hours: 8,
			breaks: 1,
			comment: 'Comment',
		},
		{
			id: 2,
			date: '14.08.2023',
			shiftNumber: 2,
			object: 'Object 2',
			equipment: 'Truck 2',
			driver: 'Petrov P.P.',
			hours: 6,
			breaks: 0.5,
			comment: 'No comment',
		},
		{
			id: 3,
			date: '15.08.2023',
			shiftNumber: 3,
			object: 'Object 3',
			equipment: 'Car 3',
			driver: 'Sidorov S.S.',
			hours: 4,
			breaks: 0.25,
			comment: '',
		},
		{
			id: 4,
			date: '15.08.2023',
			shiftNumber: 4,
			object: 'Object 4',
			equipment: 'Truck 4',
			driver: 'Ivanova I.I.',
			hours: 10,
			breaks: 1.5,
			comment: 'Long shift',
		},
	]

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

	setShiftsTableSortBy(sortBy: string) {
		switch (sortBy) {
			case 'date':
				this.shifts.sort((a, b) => {
					// const time = (date: string) => new Date(date).getTime()
					const time = (dateString: string) => {
						const [day, month, year] = dateString.split('.')
						const result = new Date(Number(year), Number(month) - 1, Number(day))
						return result.getTime()
					}
					if (time(a.date) < time(b.date)) return -1
					if (time(a.date) > time(b.date)) return 1
					return 0
				})
				break
			case 'driver':
				this.shifts.sort((a, b) => {
					if (a.driver < b.driver) return -1
					if (a.driver > b.driver) return 1
					return 0
				})
				break

			default:
				break
		}
	}

	getShiftsFromApi() {
		const data = request(url, Queries.getShifts)
		console.log(data)
		this.shifts = data.shifts || []
	}
}

export default new Store()

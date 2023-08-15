import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import authStore from './authStore'
import { graphqlRequest } from '../services/api/graphql'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const url = API_URL + '/graphql'

class ShiftsStore {
	auth = authStore
	shiftsTableFilter = {
		dateStart: dateToStringDate(new Date()),
		dateEnd: dateToStringDate(new Date(Date.now() + 3 * (24 * 60 * 60 * 1000))),
		shiftNumber: '',
		objects: [],
		equipments: [],
		drivers: [],
		hours: '', // должно быть три вида фильтра: заполнено, не заполнено, не имеет значения
		breaks: '', // аналогично hours
		comments: '', // аналогично hours
	}
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
			date: '21.08.2023',
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

	setShiftsTableSortBy(sortBy: string) {
		switch (sortBy) {
			case 'date':
				this.shifts.sort((a, b) => {
					if (dateStringToDate(a.date).getTime() < dateStringToDate(b.date).getTime()) return -1
					if (dateStringToDate(a.date).getTime() > dateStringToDate(b.date).getTime()) return 1
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

	addEmptyShifts = () => {
		this.shifts.push({
			id: this.shifts.length + 1,
			date: '',
			shiftNumber: '',
			object: '',
			equipment: '',
			driver: '',
			hours: '',
			breaks: '',
			comment: '',
		})
	}

	removeShift = (id) => {
		this.shifts = this.shifts.filter((shift) => shift.id !== id)
	}

	getShifts = async () => {
		try {
			const response = await graphqlRequest(Queries.getShifts, {
				dateStart: this.shiftsTableFilter.dateStart,
				dateEnd: this.shiftsTableFilter.dateEnd,
			})
			this.shifts = response.travelLogs
		} catch (error) {
			console.log(error)
		}
	}

	getShiftsFromApi = async () => {
		try {
			const res = await graphqlRequest(Queries.getShifts, this.shiftsTableFilter, {
				token: this.auth.token,
			})
			this.shifts = res.travelLogs
		} catch (error) {
			return new Error(error as string)
		}
	}
}

const dateStringToDate = (dateString: string) => {
	const [day, month, year] = dateString.split('.')
	return new Date(Number(year), Number(month) - 1, Number(day))
}
const dateToStringDate = (date: Date) => {
	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

export default new ShiftsStore()

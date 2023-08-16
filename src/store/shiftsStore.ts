import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import authStore from './authStore'
import { graphqlRequest } from '../services/api/graphql'

class ShiftsStore {
	auth = authStore
	shiftsTableFilter = {
		dateStart: date.dateToString(new Date()),
		dateEnd: date.dateToString(new Date(Date.now() + 3 * (24 * 60 * 60 * 1000))),
		shiftNumber: '',
		objects: [],
		equipments: [],
		drivers: [],
		hours: '', // должно быть три вида фильтра: заполнено, не заполнено, не имеет значения
		breaks: '', // аналогично hours
		comments: '', // аналогично hours
		onlyFull: true, // показывать только заполненные смены
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
					if (date.stringToDate(a.date).getTime() < date.stringToDate(b.date).getTime()) return -1
					if (date.stringToDate(a.date).getTime() > date.stringToDate(b.date).getTime()) return 1
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
	setShiftsFilterOnlyFull(onlyFull: boolean) {
		console.log(this)
		this.shiftsTableFilter.onlyFull = onlyFull
	}

	addEmptyShifts = () => {
		// Получаем даты начала и конца
		const { dateStart } = this.shiftsTableFilter
		const { dateEnd } = this.shiftsTableFilter

		// Проходим по датам от начала до конца
		let currentDate = date.stringToDate(dateStart)
		while (currentDate != date.stringToDate(dateEnd)) {
			// Проверяем, есть ли уже смены на эту дату
			const shiftsForDate = this.shifts.filter((s) => date.stringToDate(s.date) === currentDate)

			// Если смен меньше 2 - добавляем недостающие
			if (shiftsForDate.length < 2) {
				const numToAdd = 2 - shiftsForDate.length
				for (let i = 0; i < numToAdd; i++) {
					this.shifts.push({
						id: this.shifts.length + 1,
						date: date.dateToString(currentDate),
						shiftNumber: numToAdd,
						object: '',
						equipment: '',
						driver: '',
						hours: 0,
						breaks: 0,
						comment: '',
					})
				}
			}

			// Переходим к следующей дате
			currentDate = date.addDays(currentDate, 1)
		}
	}
	removeEmptyShifts = () => {
		// Фильтруем смены, у которых все поля пустые
		this.shifts = this.shifts.filter((shift) => {
			return (
				shift.object ||
				shift.equipment ||
				shift.driver ||
				shift.hours ||
				shift.breaks ||
				shift.comment
			)
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

const date = {
	stringToDate: (dateString: string) => {
		const [day, month, year] = dateString.split('.')
		return new Date(Number(year), Number(month) - 1, Number(day))
	},
	dateToString: (date: Date) => {
		return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
	},
	addDays: (date: Date, days: number) => {
		date.setDate(date.getDate() + days)
		return date
	},
}

export default new ShiftsStore()

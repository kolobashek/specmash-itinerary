import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'

class DriversStore {
	list: IDriver[] | [] = []
	driverInput: IDriverInputStore = {
		phone: '',
		name: '',
		nickname: '',
		comment: '',
		role: '',
		isActive: false,
	}
	roles: string[] | [] = []
	currentDriver: IDriver | null = null

	constructor() {
		makeAutoObservable(this)
		this.getRoles()
	}
	getDrivers = async () => {
		try {
			const drivers = (await graphqlRequest(Queries.getDrivers)) as DriversResponse | Error
			if (drivers instanceof Error) {
				return drivers
			}
			this.list = drivers.users
			return drivers.users
		} catch (error) {
			return new Error(error as string)
		}
	}
	getUserById = async (id: number) => {
		try {
			const driver = (await graphqlRequest(Queries.getUserById, { id })) as DriverResponse | Error
			if (driver instanceof Error) {
				return driver
			}
			console.log(driver.user)
			this.currentDriver = driver.user
			return driver.user
		} catch (error) {
			return new Error(error as string)
		}
	}
	getRoles = async () => {
		try {
			const roles = (await graphqlRequest(Queries.getRoles)) as RolesResponse | Error
			// console.log(types)
			if (roles instanceof Error) {
				return roles
			}
			this.roles = roles.roles
			return roles.roles
		} catch (error) {
			return new Error(error as string)
		}
	}
	setDriverInput = ({ phone, name, nickname, comment, role, isActive }: IDriverInput) => {
		phone = phone || ''
		name = name || ''
		nickname = nickname || ''
		comment = comment || ''
		role = role || ''
		isActive = isActive || false

		console.log(phone, name, nickname, comment, role, isActive)
		this.driverInput.phone = phone
		this.driverInput.name = name
		this.driverInput.nickname = nickname
		this.driverInput.comment = comment
		this.driverInput.role = role
		this.driverInput.isActive = isActive
	}
	clearDriverInput = () => {
		this.driverInput = {
			phone: '',
			name: '',
			nickname: '',
			comment: '',
			role: '',
			isActive: false,
		}
	}
	createDriver = async () => {
		try {
			const response = (await graphqlRequest(Queries.createDriver, this.driverInput)) as
				| ICreateDriverResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createUser
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateDriver = async (driver: IDriver) => {
		try {
			// TODO: Implement update driver request
			return driver
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new DriversStore()

export interface IDriver extends IDriverInput {
	id: number
}
interface DriversResponse {
	users: IDriver[]
}
interface DriverResponse {
	user: IDriver
}
interface ICreateDriverResponse {
	createUser: IDriver
}
interface RolesResponse {
	roles: string[]
}
interface IDriverInput {
	phone?: string
	name?: string
	nickname?: string
	comment?: string
	role?: string
	isActive?: boolean
}
interface IDriverInputStore {
	phone: string
	name: string
	nickname: string
	comment: string
	role: string
	isActive: boolean
}

import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'

class DriversStore {
	list: IDriver[] | [] = [
		// {
		// 	id: 1,
		// 	type: 'Погрузчик',
		// 	name: '22',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
		// {
		// 	id: 2,
		// 	type: 'Погрузчик',
		// 	name: 'XCMG LW300',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: 'Малыш',
		// },
		// {
		// 	id: 3,
		// 	type: 'Самосвал',
		// 	name: '956',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
		// {
		// 	id: 4,
		// 	type: 'Бульдозер',
		// 	name: 'т11',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
		// {
		// 	id: 5,
		// 	type: 'Погрузчик',
		// 	name: '16',
		// 	dimensions: '',
		// 	weight: '',
		// 	licensePlate: '',
		// 	nickname: '',
		// },
	]
	driverInput: IDriverInputStore = {
		phone: '',
		name: '',
		nickname: '',
		comment: '',
		role: '',
		isActive: false,
	}
	roles: Role[] | [] = []

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
		// 		console.log(
		// 			`type - ${phone ? phone : this.driverInput.phone},
		// name - ${name ? name : this.driverInput.name},
		// nickname - ${nickname ? nickname : this.driverInput.nickname},
		// comment - ${comment ? comment : this.driverInput.comment},
		// role - ${role ? role : this.driverInput.role},
		// isActive - ${isActive ? isActive : this.driverInput.isActive}`
		// 		)
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
}

export default new DriversStore()

interface IDriver extends IDriverInput {
	id: number
}
interface DriversResponse {
	users: IDriver[]
}
interface ICreateDriverResponse {
	createUser: IDriver
}
interface RolesResponse {
	roles: Role[]
}
interface Role {
	id: number
	name: string
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

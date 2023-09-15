import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'

class UsersStore {
	list: IUser[] | [] = []
	userInput: IUserInputStore = {
		phone: '',
		name: '',
		nickname: '',
		comment: '',
		role: '',
		isActive: false,
	}
	roles: string[] | [] = []
	currentUser: IUser | null = null

	constructor() {
		makeAutoObservable(this)
		this.getRoles()
	}
	getUsers = async () => {
		try {
			const users = (await graphqlRequest(Queries.getUsers)) as UsersResponse | Error
			if (users instanceof Error) {
				return users
			}
			this.list = users.users
			return users.users
		} catch (error) {
			return new Error(error as string)
		}
	}
	roleName = (role: string | undefined) => {
		if (role === 'admin') return 'Администратор'
		if (role === 'manager') return 'Менеджер'
		if (role === 'user') return 'Водитель'
		return 'Не назначена'
	}
	getUserById = async (id: number) => {
		try {
			const user = (await graphqlRequest(Queries.getUserById, { id })) as UserResponse | Error
			if (user instanceof Error) {
				return user
			}
			this.currentUser = user.user
			return user.user
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
	setUserInput = ({ phone, name, nickname, comment, role, isActive }: IUserInput) => {
		console.log(comment)
		phone = phone ?? this.userInput.phone ?? ''
		name = name ?? this.userInput.name ?? ''
		nickname = nickname ?? this.userInput.nickname ?? ''
		comment = comment ?? this.userInput.comment ?? ''
		role = role ?? this.userInput.role ?? ''
		isActive = isActive ?? this.userInput.isActive ?? false

		this.userInput.phone = phone
		this.userInput.name = name
		this.userInput.nickname = nickname
		this.userInput.comment = comment
		this.userInput.role = role
		this.userInput.isActive = isActive
	}
	setCurrentUser(user: IUser | null) {
		this.currentUser = user
	}
	clearUserInput = () => {
		this.userInput = {
			phone: '',
			name: '',
			nickname: '',
			comment: '',
			role: '',
			isActive: false,
		}
	}
	createUser = async () => {
		try {
			const response = (await graphqlRequest(Queries.createUser, this.userInput)) as
				| ICreateUserResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createUser
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateUser = async (input: IUser) => {
		try {
			const response = (await graphqlRequest(Queries.updateUser, { input })) as
				| UpdateUserResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.updateUser
		} catch (error) {
			return new Error(error as string)
		}
	}
}

export default new UsersStore()

export interface IUser extends IUserInput {
	id: number
}
interface UsersResponse {
	users: IUser[]
}
interface UserResponse {
	user: IUser
}
interface UpdateUserResponse {
	updateUser: IUser
}
interface ICreateUserResponse {
	createUser: IUser
}
interface RolesResponse {
	roles: string[]
}
export interface IUserInput {
	phone?: string
	name?: string
	nickname?: string
	comment?: string
	role?: string
	isActive?: boolean
}
interface IUserInputStore {
	phone: string
	name: string
	nickname: string
	comment: string
	role: string
	isActive: boolean
}

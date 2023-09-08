import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'
import { IContrAgent } from './contrAgentStore'

class ObjectStore {
	list: IObject[] | [] = []
	objectInput: IObjectInputStore = {
		name: '',
		contacts: '',
		address: '',
		comment: '',
		contrAgents: [],
	}
	currentObject: IObject | null = null

	constructor() {
		makeAutoObservable(this)
		// this.getObjects()
	}
	getObjects = async () => {
		try {
			const objects = (await graphqlRequest(Queries.getObjects)) as ObjectsResponse | Error
			if (objects instanceof Error) {
				return objects
			}
			this.list = objects.objects
			return objects.objects
		} catch (error) {
			return new Error(error as string)
		}
	}
	getObjectById = async (id: number) => {
		try {
			const object = (await graphqlRequest(Queries.getObjectById, { id })) as ObjectResponse | Error
			if (object instanceof Error) {
				return object
			}
			this.currentObject = object.object
			return object.object
		} catch (error) {
			return new Error(error as string)
		}
	}
	// getObjects = async () => {
	// 	try {
	// 		const objects = (await graphqlRequest(Queries.getObjects)) as ObjectsResponse | Error
	// 		// console.log(types)
	// 		if (objects instanceof Error) {
	// 			return objects
	// 		}
	// 		this.objects = objects.objects
	// 		return objects.objects
	// 	} catch (error) {
	// 		return new Error(error as string)
	// 	}
	// }
	setObjectInput = ({ name, contacts, address, comment, contrAgents }: IObjectInput) => {
		console.log(comment)
		name = name ?? this.objectInput.name ?? ''
		contacts = contacts ?? this.objectInput.contacts ?? ''
		address = address ?? this.objectInput.address ?? ''
		comment = comment ?? this.objectInput.comment ?? ''
		contrAgents = contrAgents ?? this.objectInput.contrAgents ?? false

		this.objectInput.name = name
		this.objectInput.contacts = contacts
		this.objectInput.comment = comment
		this.objectInput.comment = comment
		this.objectInput.contrAgents = contrAgents
	}
	setCurrentObject(object: IObject | null) {
		this.currentObject = object
	}
	clearObjectInput = () => {
		this.objectInput = {
			name: '',
			contacts: '',
			address: '',
			comment: '',
			contrAgents: [],
		}
	}
	createObject = async () => {
		try {
			const response = (await graphqlRequest(Queries.createObject, this.objectInput)) as
				| ICreateObjectResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createUser
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateObject = async (input: IObject) => {
		try {
			const response = (await graphqlRequest(Queries.updateUser, { input })) as
				| UpdateObjectResponse
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

export default new ObjectStore()

export interface IObject extends IObjectInput {
	id: number
}
interface ObjectsResponse {
	objects: IObject[]
}
interface ObjectResponse {
	object: IObject
}
interface UpdateObjectResponse {
	updateUser: IObject
}
interface ICreateObjectResponse {
	createUser: IObject
}
// interface ObjectsResponse {
// 	objects: Object[]
// }
interface IObjectInput {
	name?: string
	contacts?: string
	address?: string
	comment?: string
	contrAgents?: IContrAgent[]
}
interface IObjectInputStore {
	name: string
	contacts: string
	address: string
	comment: string
	contrAgents: IContrAgent[]
}

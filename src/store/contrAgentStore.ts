import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'
import { IObject } from './objectStore'

class ContrAgentStore {
	list: IContrAgent[] | [] = []
	contrAgentData: IContrAgentDataStore = {
		name: '',
		contacts: '',
		address: '',
		comment: '',
		objects: [],
	}
	currentContrAgent: IContrAgent | null = null

	constructor() {
		makeAutoObservable(this)
		// this.getObjects()
	}
	getContrAgents = async () => {
		try {
			const contrAgents = (await graphqlRequest(Queries.getContrAgents)) as
				| ContrAgentsResponse
				| Error
			if (contrAgents instanceof Error) {
				return contrAgents
			}
			this.list = contrAgents.contrAgents
			return contrAgents.contrAgents
		} catch (error) {
			return new Error(error as string)
		}
	}
	getContrAgentById = async (id: number) => {
		try {
			const contrAgent = (await graphqlRequest(Queries.getUserById, { id })) as
				| ContrAgentResponse
				| Error
			if (contrAgent instanceof Error) {
				return contrAgent
			}
			this.currentContrAgent = contrAgent.contrAgent
			return contrAgent.contrAgent
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
	setContrAgentData = ({ name, contacts, address, comment, objects }: IContrAgentData) => {
		console.log(comment)
		name = name ?? this.contrAgentData.name ?? ''
		contacts = contacts ?? this.contrAgentData.contacts ?? ''
		address = address ?? this.contrAgentData.address ?? ''
		comment = comment ?? this.contrAgentData.comment ?? ''
		objects = objects ?? this.contrAgentData.objects ?? false

		this.contrAgentData.name = name
		this.contrAgentData.contacts = contacts
		this.contrAgentData.comment = comment
		this.contrAgentData.comment = comment
		this.contrAgentData.objects = objects
	}
	setCurrentContrAgent(contrAgent: IContrAgent | null) {
		this.currentContrAgent = contrAgent
	}
	clearContrAgentData = () => {
		this.contrAgentData = {
			name: '',
			contacts: '',
			address: '',
			comment: '',
			objects: [],
		}
	}
	createContrAgent = async (input: IContrAgentData) => {
		try {
			const response = (await graphqlRequest(Queries.createContrAgent, { input })) as
				| ICreateContrAgentResponse
				| Error
			if (response instanceof Error) {
				return response
			}
			return response.createUser
		} catch (error) {
			return new Error(error as string)
		}
	}
	updateContrAgent = async (input: IContrAgent) => {
		try {
			const response = (await graphqlRequest(Queries.updateUser, { input })) as
				| UpdateContrAgentResponse
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

export default new ContrAgentStore()

export interface IContrAgent extends IContrAgentData {
	id: number
}
interface ContrAgentsResponse {
	contrAgents: IContrAgent[]
}
interface ContrAgentResponse {
	contrAgent: IContrAgent
}
interface UpdateContrAgentResponse {
	updateUser: IContrAgent
}
interface ICreateContrAgentResponse {
	createUser: IContrAgent
}
// interface ObjectsResponse {
// 	objects: IObject[]
// }
export interface IContrAgentData {
	name?: string
	contacts?: string
	address?: string
	comment?: string
	objects?: IObject[]
}
interface IContrAgentDataStore {
	name: string
	contacts: string
	address: string
	comment: string
	objects: IObject[]
}

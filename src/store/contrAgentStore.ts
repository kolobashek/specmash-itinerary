import { makeAutoObservable } from 'mobx'
import Queries from '../services/api/queries'
import { graphqlRequest } from '../services/api/graphql'

class ContrAgentStore {
	list: IContrAgent[] | [] = []
	contrAgentInput: IContrAgentInputStore = {
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
	getUserById = async (id: number) => {
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
	setContrAgentInput = ({ name, contacts, address, comment, objects }: IContrAgentInput) => {
		console.log(comment)
		name = name ?? this.contrAgentInput.name ?? ''
		contacts = contacts ?? this.contrAgentInput.contacts ?? ''
		address = address ?? this.contrAgentInput.address ?? ''
		comment = comment ?? this.contrAgentInput.comment ?? ''
		objects = objects ?? this.contrAgentInput.objects ?? false

		this.contrAgentInput.name = name
		this.contrAgentInput.contacts = contacts
		this.contrAgentInput.comment = comment
		this.contrAgentInput.comment = comment
		this.contrAgentInput.objects = objects
	}
	setCurrentContrAgent(contrAgent: IContrAgent | null) {
		this.currentContrAgent = contrAgent
	}
	clearContrAgentInput = () => {
		this.contrAgentInput = {
			name: '',
			contacts: '',
			address: '',
			comment: '',
			objects: [],
		}
	}
	createContrAgent = async () => {
		try {
			const response = (await graphqlRequest(Queries.createContrAgent, this.contrAgentInput)) as
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

export interface IContrAgent extends IContrAgentInput {
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
interface ObjectsResponse {
	objects: Object[]
}
interface IContrAgentInput {
	name?: string
	contacts?: string
	address?: string
	comment?: string
	objects?: Object[]
}
interface IContrAgentInputStore {
	name: string
	contacts: string
	address: string
	comment: string
	objects: Object[]
}

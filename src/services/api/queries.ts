import { APIError } from 'graphql-hooks'

const Queries = {
	isActive: /* GraphQL */ `
		query isActive($userId: ID!) {
			isActive(userId: $userId)
		}
	`,

	getRoles: /* GraphQL */ `
		query getRoles {
			roles
		}
	`,

	register: /* GraphQL */ `
		mutation createUser($input: CreateUserInput!) {
			createUser(input: $input)
		}
	`,

	login: /* GraphQL */ `
		mutation Login($phone: String!, $password: String!) {
			login(phone: $phone, password: $password) {
				token
			}
		}
	`,

	me: /* GraphQL */ `
		query AboutUser {
			me {
				comment
				id
				isActive
				name
				nickname
				password
				phone
				role
			}
		}
	`,

	getShifts: /* GraphQL */ `
		query getShifts($dateStart: String, $dateEnd: String) {
			travelLogs(dateStart: $dateStart, dateEnd: $dateEnd) {
				id
				driver {
					id
					name
				}
				object {
					id
					name
				}
				equipment {
					id
					name
				}
				date
				shiftNumber
				hours
				breaks
				comment
			}
		}
	`,

	getMachines: /* GraphQL */ `
		query getEquipments {
			equipments {
				id
				type
				name
				dimensions
				weight
				licensePlate
				nickname
			}
		}
	`,

	getMachineById: /* GraphQL */ `
		query equipment($id: ID!) {
			equipment(id: $id) {
				id
				type
				name
				dimensions
				weight
				licensePlate
				nickname
			}
		}
	`,

	getMachineTypes: /* GraphQL */ `
		query getEquipmentTypes {
			getEquipmentTypes {
				id
				name
			}
		}
	`,

	createMachine: /* GraphQL */ `
		mutation CreateEquipment($input: CreateEquipmentInput!) {
			createEquipment(input: $input) {
				id
			}
		}
	`,

	createUser: /* GraphQL */ `
		mutation CreateUser(
			$phone: String!
			$name: String!
			$nickname: String
			$comment: String
			$role: String
			$isActive: String
		) {
			createEquipment(
				phone: $phone
				name: $name
				nickname: $nickname
				comment: $comment
				isActive: $isActive
				role: $role
			) {
				id
				password
			}
		}
	`,

	getUsers: /* GraphQL */ `
		query users {
			users {
				id
				phone
				name
				nickname
				comment
				role
				isActive
			}
		}
	`,

	getUserById: /* GraphQL */ `
		query user($id: ID!) {
			user(id: $id) {
				id
				phone
				name
				nickname
				comment
				role
				isActive
			}
		}
	`,
	updateUser: /* GraphQL */ `
		mutation updateUser($input: UpdateUserInput!) {
			updateUser(input: $input) {
				id
				phone
				name
				nickname
				comment
				role
				isActive
			}
		}
	`,
	updateMachine: /* GraphQL */ `
		mutation updateEquipment($input: UpdateEquipmentInput!) {
			updateEquipment(input: $input) {
				id
				type
				name
				dimensions
				weight
				licensePlate
				nickname
			}
		}
	`,

	getContrAgents: /* GraphQL */ `
		query contrAgents {
			contrAgents {
				id
				name
				contacts
				address
				comments
				objects {
					id
					name
				}
			}
		}
	`,

	createContrAgent: /* GraphQL */ `
		mutation createContrAgent(
			$name: String!
			$contacts: String
			$address: String
			$comment: String
			$objects: [Int!]
		) {
			createEquipment(
				name: $name
				contacts: $contacts
				address: $address
				comment: $comment
				objects: $objects
			) {
				id
				name
				contacts
				address
				comment
				objects
			}
		}
	`,

	getObjects: /* GraphQL */ `
		query objects {
			objects {
				id
				name
				contacts
				address
				contrAgents {
					id
					name
				}
			}
		}
	`,

	getObjectById: /* GraphQL */ `
		query object($id: ID!) {
			object(id: $id) {
				id
				name
				contacts
				address
				contrAgents {
					id
					name
				}
			}
		}
	`,

	createObject: /* GraphQL */ `
		mutation createObject(
			$name: String!
			$contacts: String
			$address: String
			$comment: String
			$contrAgents: [Int!]
		) {
			createObject(
				name: $name
				contacts: $contacts
				address: $address
				comment: $comment
				contrAgents: $contrAgents
			) {
				id
				name
				contacts
				address
				comment
				contrAgents
			}
		}
	`,
}

export function handleApiError(error: APIErrors) {
	let message = ''
	if (error.fetchError) {
		// Обработка ошибки fetch
		// console.log(error.fetchError)
		message = message.concat(error.fetchError.message)
	}

	if (error.httpError) {
		// Обработка HTTP ошибки
		// console.log(error.httpError.status)
		message = message.concat(error.httpError.statusText)
	}

	if (error.graphQLErrors) {
		// Обработка ошибок GraphQL
		error.graphQLErrors.forEach((graphQLError) => {
			// console.log('handleApiError', graphQLError.message)
			message = message.concat(graphQLError.message)
		})
	}

	return message
}

export interface APIErrors extends APIError {
	graphQLErrors?: GraphQLError[]
}

interface GraphQLError {
	message: string
	locations: object[]
	path: string[]
}

export default Queries

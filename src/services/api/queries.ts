import { APIError } from 'graphql-hooks'

const Queries = {
	isActive: /* GraphQL */ `
		query isActive($userId: ID!) {
			isActive(userId: $userId)
		}
	`,

	getRoles: /* GraphQL */ `
		query getRoles {
			roles {
				id
				name
			}
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
				role {
					name
					id
				}
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

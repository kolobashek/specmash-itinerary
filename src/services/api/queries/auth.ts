export const auth = {
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
}

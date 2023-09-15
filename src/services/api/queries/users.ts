export const users = {
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
}

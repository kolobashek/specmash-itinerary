export const objects = {
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

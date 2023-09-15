export const contrAgents = {
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
}

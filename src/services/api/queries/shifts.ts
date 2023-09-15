export const shifts = {
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
}

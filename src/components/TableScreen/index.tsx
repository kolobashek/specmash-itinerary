import React, { useMemo, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import store from '../../store'
import { observer } from 'mobx-react-lite'

export const TableScreen = observer(() => {
	const { shiftsTableSortBy, shifts, getShiftsFromApi } = store.shifts
	const today = new Date()

	return (
		<ScrollView horizontal={true}>
			<Text onPress={getShiftsFromApi}>Таблица путевых листов</Text>

			<View>
				<View style={[styles.row, styles.header]}>
					{cols.map((col) => {
						const { key, label } = col
						return (
							<Text
								style={[styles.cell, styles.cellHeader]}
								onPress={() => store.shifts.setShiftsTableSortBy(key)}
								key={key}
							>
								{label}
							</Text>
						)
					})}
				</View>
				{shifts.map(TableRow)}
			</View>
		</ScrollView>
	)
})

const TableRow = (item: Shift, key: number) => {
	const { id, date, shiftNumber, object, equipment, driver, hours, breaks, comment } = item
	return (
		<View style={styles.row} key={key}>
			<Text style={styles.cell}>{date || '--'}</Text>
			<Text style={styles.cell}>{shiftNumber || '--'}</Text>
			<Text style={styles.cell}>{object || '--'}</Text>
			<Text style={styles.cell}>{equipment || '--'}</Text>
			<Text style={styles.cell}>{driver || '--'}</Text>
			<Text style={styles.cell}>{hours || '--'}</Text>
			<Text style={styles.cell}>{breaks || '--'}</Text>
			<Text style={styles.cell}>{comment || '--'}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 20,
	},
	table: {
		flex: 1,
		paddingHorizontal: 16, // добавили горизонтальный padding
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#ddd',
	},
	header: {
		flexDirection: 'row',
		borderBottomWidth: 2, // увеличили толщину линии для заголовка
	},
	cell: {
		flex: 1,
		padding: 10,
		textAlign: 'center', // выравнивание по центру
	},
	cellHeader: {
		flex: 1,
		padding: 10,
		fontWeight: 'bold', // жирный шрифт
		textAlign: 'center',
	},
})

type Shift = {
	id: number
	date: string
	shiftNumber: number
	object: string
	equipment: string
	driver: string
	hours: number
	breaks: number
	comment: string
}
type ColType = {
	key: string
	label: string
}
const cols = [
	{ key: 'date', label: 'Дата' },
	{ key: 'shiftNumber', label: 'Смена' },
	{ key: 'object', label: 'Объект' },
	{ key: 'equipment', label: 'Машина' },
	{ key: 'driver', label: 'Водитель' },
	{ key: 'hours', label: 'Часы работы' },
	{ key: 'breaks', label: 'Часы простоя' },
	{ key: 'comment', label: 'Комментарий' },
]

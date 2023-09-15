import React from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { FAB } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { IShift } from '../../store/shiftsStore'

export const TableScreen = observer(({ navigation }: any) => {
	const [visible, setVisible] = React.useState(true)
	const {
		setShiftsTableSortBy,
		shifts,
		getShiftsFromApi,
		setShiftsFilterOnlyFull,
		shiftsTableFilter,
		addEmptyShifts,
		removeEmptyShifts,
	} = store.shifts

	const showSchedule = () => {
		setShiftsFilterOnlyFull(!shiftsTableFilter.onlyFull)
		if (shiftsTableFilter.onlyFull) {
			removeEmptyShifts()
		} else {
			addEmptyShifts()
		}
	}
	return (
		<>
			<ScrollView horizontal={true}>
				<View>
					<View style={[styles.row, styles.header]}>
						{cols.map((col) => {
							const { key, label } = col
							return (
								<Text
									style={[styles.cell, styles.cellHeader]}
									onPress={() => setShiftsTableSortBy(key)}
									key={key}
								>
									{label}
								</Text>
							)
						})}
					</View>
					{shifts.map(TableRow)}
					<>
						<FAB
							visible={visible}
							onPress={() => setVisible(!visible)}
							placement='right'
							title='Редактировать'
							icon={{ name: 'edit', color: 'white' }}
							color='red'
						/>
						<FAB
							visible={!visible}
							onPress={() => setVisible(!visible)}
							placement='right'
							title='Сохранить'
							icon={{ name: 'save', color: 'white' }}
							color='green'
						/>
					</>
					<FAB
						visible={shiftsTableFilter.onlyFull}
						onPress={showSchedule}
						placement='left'
						title='Показать все'
						icon={{ name: 'visibility', color: 'white' }}
						color='grey'
					/>
				</View>
			</ScrollView>
		</>
	)
})

const TableRow = (item: IShift, key: number) => {
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

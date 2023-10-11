import React from 'react' // импорт React
import { StyleSheet, View, Text, ScrollView } from 'react-native' // импорт компонентов из React Native
import { FAB } from '@rneui/themed' // импорт FAB компонента
import DateTimePicker from '@react-native-community/datetimepicker' // импорт компонента DateTimePicker
import store from '../../store' // импорт хранилища
import { observer } from 'mobx-react-lite' // импорт observer из mobx-react-lite
import { IShift } from '../../store/shiftsStore' // импорт интерфейса IShift
import { ShiftForm } from './ShiftForm'
import { ShiftsList } from './ShiftsList'
import { ShiftStackParamList } from '../../../App'
import { StackScreenProps } from '@react-navigation/stack'
import { useLinkTo } from '@react-navigation/native'

type Props = StackScreenProps<ShiftStackParamList, 'ShiftScreen'>
export const ShiftScreen = observer(({ navigation }: Props) => {
	// экспорт компонента TableScreen как observer
	const linkTo = useLinkTo()

	const {
		// деструктуризация нужных методов из store
		setShiftsTableSortBy,
		shifts,
		getShiftsFromApi,
		// setShiftsFilterOnlyFull,
		shiftsTableFilter,
		addEmptyShifts,
		removeEmptyShifts,
	} = store.shifts
	console.log('shift screen')

	// Отрисовка компонента
	return (
		<>
			{/* Компонент для горизонтальной прокрутки списка смен */}
			<ScrollView horizontal={true}>
				<View>
					<ShiftsList shiftsList={shifts} />
					{/* Кнопка фильтров */}
					{/* <FAB
						visible={shiftsTableFilter.onlyFull}
						onPress={showSchedule}
						placement='left'
						title='Показать все'
						icon={{ name: 'visibility', color: 'white' }}
						color='grey'
					/> */}
				</View>
			</ScrollView>
			<FAB
				visible={true}
				onPress={() => linkTo('/shifts/new')}
				placement='right'
				icon={{ name: 'add', color: 'white' }}
				color='green'
			/>
		</>
	)
})

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

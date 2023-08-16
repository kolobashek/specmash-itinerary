import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { FAB, Input, ListItem } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../store'
import { observer } from 'mobx-react-lite'

export const MachineScreen = observer(() => {
	useEffect(() => {
		console.log('first')
		store.machines.getMachines()
	}, [])

	const [visible, setVisible] = useState(true)
	const { machines } = store.machines
	const addMachineHandler = () => {
		setVisible(false)
	}
	const addMachineSubmit = () => {
		setVisible(true)
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
									// onPress={{}}
									key={key}
								>
									{label}
								</Text>
							)
						})}
					</View>
					{machines.map((machine) => {
						return (
							<View key={machine.id} style={[styles.row]}>
								<Text style={styles.cell}>{machine.name}</Text>
								<Text style={styles.cell}>{machine.type}</Text>
								<Text style={styles.cell}>{machine.dimensions}</Text>
								<Text style={styles.cell}>{machine.weight}</Text>
								<Text style={styles.cell}>{machine.licensePlate}</Text>
								<Text style={styles.cell}>{machine.nickname}</Text>
							</View>
						)
					})}
					{!visible && (
						<View>
							<Input style={styles.cell} />
							<Input style={styles.cell} />
							<Input style={styles.cell} />
							<Input style={styles.cell} />
							<Input style={styles.cell} />
							<Input style={styles.cell} />
						</View>
					)}
				</View>
			</ScrollView>
			<FAB
				visible={visible}
				onPress={addMachineHandler}
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
	{ key: 'name', label: 'Марка/модель' },
	{ key: 'type', label: 'Тип' },
	{ key: 'dimensions', label: 'Габариты' },
	{ key: 'weight', label: 'Масса' },
	{ key: 'licensePlate', label: 'ГРЗ' },
	{ key: 'nickname', label: 'Кодовое имя' },
]

import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../store'
import { observer } from 'mobx-react-lite'

export const MachineScreen = observer(() => {
	useEffect(() => {
		store.machines.getMachines()
		// console.log(store.machines.types)
	}, [store.machines.types])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const { machines, machineInput, types, setMachineInput, getMachineTypes } = store.machines
	const addMachineHandler = async () => {
		setVisibleAddButton(false)
	}
	const addMachineSubmit = () => {
		setVisibleAddButton(true)
	}
	const typesList = [
		...types.map((type) => {
			return {
				key: type.id,
				title: type.name,
				containerStyle: { backgroundColor: 'white' },
				titleStyle: { color: 'black' },
				onPress: async () => {
					setMachineInput({ type: type.name })
					setIsVisibleBS(false)
				},
			}
		}),
		{
			title: 'Cancel',
			containerStyle: { backgroundColor: 'red' },
			titleStyle: { color: 'white' },
			onPress: () => {
				setIsVisibleBS(false)
				setVisibleAddButton(true)
			},
		},
	]
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
					{!visibleAddButton && (
						<>
							<View style={[styles.row]}>
								<View style={styles.cell}>
									<Input placeholder='Марка/модель' value={machineInput.name} />
								</View>
								<View style={styles.cell}>
									<Button title={machineInput.type || 'Тип'} onPress={() => setIsVisibleBS(true)} />
									<BottomSheet modalProps={{}} isVisible={isVisibleBS}>
										{typesList.map((l, i) => (
											<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
												<ListItem.Content>
													<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
												</ListItem.Content>
											</ListItem>
										))}
									</BottomSheet>
								</View>
								<View style={styles.cell}>
									<Input />
								</View>
								<View style={styles.cell}>
									<Input />
								</View>
								<View style={styles.cell}>
									<Input />
								</View>
								<View style={styles.cell}>
									<Input />
								</View>
							</View>
							<Button
								// style={styles.row}
								color={'green'}
								icon={{ name: 'success', color: 'white' }}
							/>
						</>
					)}
				</View>
			</ScrollView>
			<FAB
				visible={visibleAddButton}
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

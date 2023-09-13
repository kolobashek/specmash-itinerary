import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IMachine } from '../../store/machinesStore'
import { StackScreenProps } from '@react-navigation/stack'
import { MachinesStackParamList } from '../../../App'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'

type Props = StackScreenProps<MachinesStackParamList, 'MachineDetails'>

export const MachineCard = observer(({ navigation }: Props) => {
	const {
		currentMachine,
		setCurrentMachine,
		getMachineById,
		getMachines,
		updateMachine,
		clearMachineData,
		setMachineData,
		types,
		machineData,
	} = store.machines
	const machineId = Number(
		navigation.getState().routes.find((r) => r.name === 'MachineDetails')?.params?.id
	)
	useEffect(() => {
		const machine = async () => {
			const input = await getMachineById(machineId)
			if (input instanceof Error) {
				return new Error('Unable to fetch machine')
			}
			setMachineData(input)
		}
		machine()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editMachineHandler = () => {
		setVisibleEditButton(!visibleEditButton)
	}
	const editMachineSubmit = async (id: number) => {
		setLoading(true)
		const updatedMachine = await updateMachine({ id, ...machineData })
		if (updatedMachine instanceof Error) {
			console.log(updatedMachine)
			setUpdateError(updatedMachine.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		console.log(currentMachine)
		setCurrentMachine(updatedMachine)
		console.log(currentMachine)
		setVisibleEditButton(true)
		setLoading(false)
		// clearMachineData()
		return updatedMachine
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setMachineData({ isActive: !isActive })
	// }
	if (!currentMachine) return <Text>Что-то пошло не так.</Text>
	if (!visibleEditButton)
		return (
			<>
				<Card>
					<Card.Title>
						{`${currentMachine.name}` +
							(currentMachine.nickname ? `, ${currentMachine.nickname}` : '')}
					</Card.Title>
					<Card.Divider />
					<View>
						<ListItem>
							<ListItem.Title>Наименование:</ListItem.Title>
							<ListItem.Input
								placeholder={currentMachine.name || machineData.name || 'Наименование'}
								value={machineData.name}
								onChangeText={(text) => setMachineData({ name: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem>
						<ListItem>
							<ListItem.Title>Позывной:</ListItem.Title>
							<ListItem.Input
								placeholder={currentMachine.nickname || machineData.nickname || 'Позывной'}
								value={machineData.nickname}
								onChangeText={(text) => setMachineData({ nickname: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem>
						<ListItem>
							<ListItem.Title>Вес, кг:</ListItem.Title>
							<ListItem.Input
								placeholder='12000'
								value={machineData.weight.toString()}
								onChangeText={(text) => setMachineData({ weight: Number(text) })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem>
						<ListItem>
							<ListItem.Title>Роль: </ListItem.Title>
							<Dropdown
								style={styles.dropdown}
								placeholderStyle={styles.placeholderStyle}
								selectedTextStyle={styles.selectedTextStyle}
								inputSearchStyle={styles.inputSearchStyle}
								iconStyle={styles.iconStyle}
								data={types.map((type) => {
									return { label: type.name, value: type.id }
								})}
								search
								maxHeight={300}
								labelField='label'
								valueField='value'
								placeholder={currentMachine.type || 'Select item'}
								searchPlaceholder='Search...'
								value={machineData.type}
								onChange={(type) => setMachineData({ type: type.label })}
								renderLeftIcon={() => {
									return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
								}}
								renderItem={(item) => {
									return (
										<View style={styles.item}>
											<Text style={styles.textItem}>{item.label}</Text>
											{item.label === machineData.type && (
												<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
											)}
										</View>
									)
								}}
								disable={loading}
							/>
						</ListItem>
						<ListItem>
							<ListItem.Title>Гос. номер:</ListItem.Title>
							<ListItem.Input
								placeholder='А 000 АА 000'
								value={machineData.licensePlate}
								onChangeText={(text) => setMachineData({ licensePlate: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem>
					</View>
					{updateError && (
						<>
							<Card.Divider />
							<Text style={{ color: 'red' }}>{updateError}</Text>
						</>
					)}
				</Card>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={() => editMachineSubmit(machineId)}
					placement='left'
					icon={{ name: 'check', color: 'white' }}
					color='green'
				/>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={editMachineHandler}
					placement='right'
					icon={{ name: 'cancel', color: 'white' }}
					color='red'
				/>
			</>
		)
	return (
		<>
			<Card>
				<Card.Title>
					{`${currentMachine.name}` +
						(currentMachine.nickname ? `, ${currentMachine.nickname}` : '')}
				</Card.Title>
				<Card.Divider />
				<View>
					<ListItem>
						<ListItem.Title>Вес, кг:</ListItem.Title>
						<ListItem.Subtitle>{`${currentMachine.weight}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Тип: </ListItem.Title>
						<ListItem.Subtitle>{`${currentMachine.type}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Гос. номер:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentMachine.licensePlate ? currentMachine.licensePlate : ''
						}`}</ListItem.Subtitle>
					</ListItem>
				</View>
			</Card>
			<FAB
				visible={visibleEditButton}
				onPress={editMachineHandler}
				placement='right'
				icon={{ name: 'edit', color: 'white' }}
				color='green'
			/>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	dropdown: {
		margin: 16,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
	},
	icon: {
		marginRight: 5,
	},
	item: {
		padding: 17,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textItem: {
		flex: 1,
		fontSize: 16,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
})

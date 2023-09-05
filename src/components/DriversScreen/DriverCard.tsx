import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IDriver } from '../../store/driversStore'
import { StackScreenProps } from '@react-navigation/stack'
import { DriversStackParamList } from '../../../App'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'

type Props = StackScreenProps<DriversStackParamList, 'DriverDetails'>

export const DriverCard = observer(({ navigation }: Props) => {
	const {
		currentDriver,
		setCurrentDriver,
		getUserById,
		getDrivers,
		updateDriver,
		clearDriverInput,
		setDriverInput,
		roles,
		driverInput,
		roleName,
	} = store.drivers
	const driverId = Number(
		navigation.getState().routes.find((r) => r.name === 'DriverDetails')?.params?.id
	)
	useEffect(() => {
		const user = async () => {
			const input = await getUserById(driverId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setDriverInput(input)
		}
		user()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editDriverHandler = () => {
		setVisibleEditButton(!visibleEditButton)
	}
	const editDriverSubmit = async (id: number) => {
		setLoading(true)
		const newDriver = await updateDriver({ id, ...driverInput })
		if (newDriver instanceof Error) {
			console.log(newDriver)
			setUpdateError(newDriver.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentDriver(newDriver)
		setVisibleEditButton(true)
		setLoading(false)
		clearDriverInput()
		return newDriver
	}
	const isActiveHandler = () => {
		setIsActive(!isActive)
		setDriverInput({ isActive: !isActive })
	}
	const rolesList = [
		...roles.map((role, key) => {
			return {
				key,
				title: localizedRoleName(role),
				containerStyle: { backgroundColor: 'white' },
				titleStyle: { color: 'black' },
				onPress: async () => {
					setDriverInput({ role })
					setIsVisibleBS(false)
				},
			}
		}),
		{
			title: 'Отмена',
			containerStyle: { backgroundColor: 'red' },
			titleStyle: { color: 'white' },
			onPress: () => {
				setIsVisibleBS(false)
				setVisibleEditButton(true)
			},
		},
	]
	if (!currentDriver) return <Text>Что-то пошло не так.</Text>
	if (!visibleEditButton)
		return (
			<>
				<Card>
					<Card.Title>
						{`${currentDriver.name}` +
							(currentDriver.nickname ? `, ${currentDriver.nickname}` : '')}
					</Card.Title>
					<Card.Divider />
					<View>
						<ListItem>
							<ListItem.Title>Телефон:</ListItem.Title>
							<ListItem.Input
								placeholder='00000000000'
								value={driverInput.phone}
								onChangeText={(text) => setDriverInput({ phone: text })}
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
								data={roles.map((role) => {
									return { label: roleName(role), value: role }
								})}
								search
								maxHeight={300}
								labelField='label'
								valueField='value'
								placeholder='Select item'
								searchPlaceholder='Search...'
								value={driverInput.role}
								onChange={(role) => setDriverInput({ role: role.value })}
								renderLeftIcon={() => {
									return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
								}}
								renderItem={(item) => {
									return (
										<View style={styles.item}>
											<Text style={styles.textItem}>{item.label}</Text>
											{item.value === driverInput.role && (
												<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
											)}
										</View>
									)
								}}
								disable={loading}
							/>
						</ListItem>
						<ListItem>
							<ListItem.Title>Комментарий:</ListItem.Title>
							<ListItem.Input
								placeholder='Комментарии'
								value={driverInput.comment}
								onChangeText={(text) => setDriverInput({ comment: text })}
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
					onPress={() => editDriverSubmit(driverId)}
					placement='left'
					icon={{ name: 'check', color: 'white' }}
					color='green'
				/>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={editDriverHandler}
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
					{`${currentDriver.name}` + (currentDriver.nickname ? `, ${currentDriver.nickname}` : '')}
				</Card.Title>
				<Card.Divider />
				<View>
					<ListItem>
						<ListItem.Title>Телефон:</ListItem.Title>
						<ListItem.Subtitle>{`${currentDriver.phone}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Роль: </ListItem.Title>
						<ListItem.Subtitle>{`${roleName(currentDriver.role)}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Комментарий:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentDriver.comment ? currentDriver.comment : ''
						}`}</ListItem.Subtitle>
					</ListItem>
				</View>
			</Card>
			<FAB
				visible={visibleEditButton}
				onPress={editDriverHandler}
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

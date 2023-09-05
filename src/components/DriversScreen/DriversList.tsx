import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Avatar } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
// import { DrawerScreenProps } from '@react-navigation/drawer'
import { DriversStackParamList } from '../../../App'
import { DriverCard } from './DriverCard'
import { StackScreenProps } from '@react-navigation/stack'
import { Link } from '@react-navigation/native'
import * as Device from 'expo-device'

type Props = StackScreenProps<DriversStackParamList, 'DriversList'>

export const DriversList = observer(({ navigation }: Props) => {
	const { list, driverInput, roles, setDriverInput, createDriver, clearDriverInput, getDrivers } =
		store.drivers
	useEffect(() => {
		getDrivers()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const addDriverHandler = async () => {
		setVisibleAddButton(false)
	}
	const addDriverSubmit = async () => {
		setLoading(true)
		const newDriver = await createDriver()
		if (newDriver instanceof Error) {
			console.log(newDriver)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearDriverInput()
		getDrivers()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	const isActiveHandler = () => {
		setIsActive(!isActive)
		setDriverInput({ isActive: !isActive })
	}
	const memoizedRoleName = React.useMemo(() => {
		return (role: string | undefined) => {
			if (role === 'admin') return 'Администратор'
			if (role === 'manager') return 'Менеджер'
			return 'Водитель'
		}
	}, [])
	// const currentDriver = navigation.getState().routes.find((r) => r.name === 'DriversList')
	// 	?.params?.id
	const rolesList = [
		...roles.map((role, key) => {
			return {
				key,
				title: memoizedRoleName(role),
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
				setVisibleAddButton(true)
			},
		},
	]
	const device = Device.DeviceType[Device.deviceType || 0]
	return (
		<>
			<ScrollView stickyHeaderHiddenOnScroll stickyHeaderIndices={[0]}>
				{/* <StickyHeader titles={cols} /> */}
				<View style={styles.table}>
					{list.map((driver) => {
						return (
							<Link
								to={
									device === 'DESKTOP'
										? `/drivers/${driver.id}`
										: { screen: 'DriverDetails', params: { id: driver.id } }
								}
								key={driver.id}
								style={[styles.link]}
							>
								<ListItem bottomDivider style={styles.row} containerStyle={styles.row}>
									<Avatar
										rounded
										title={driver.name?.charAt(0).toUpperCase()}
										containerStyle={{ backgroundColor: 'grey' }}
									/>
									<ListItem.Content>
										<ListItem.Title>{driver.name}</ListItem.Title>
										<ListItem.Subtitle>{memoizedRoleName(driver.role)}</ListItem.Subtitle>
									</ListItem.Content>
								</ListItem>
							</Link>
						)
					})}
					{!visibleAddButton && (
						<>
							<View style={[styles.row]}>
								<View style={styles.inputsCell}>
									<Input
										placeholder='ФИО'
										value={driverInput.name}
										onChangeText={(e) => setDriverInput({ name: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Телефон'
										value={driverInput.phone}
										onChangeText={(e) => {
											console.log(e)
											setDriverInput({ phone: e })
										}}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Псевдоним'
										value={driverInput.nickname}
										onChangeText={(e) => setDriverInput({ nickname: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Комментарий'
										value={driverInput.comment}
										onChangeText={(e) => setDriverInput({ comment: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Button
										title={driverInput.role || 'Роль'}
										onPress={() => setIsVisibleBS(true)}
										disabled={loading}
									/>
									<Button
										color={isActive ? 'gray' : 'warning'}
										icon={
											isActive
												? { name: 'check', color: 'white' }
												: { name: 'cancel', color: 'white' }
										}
										onPress={isActiveHandler}
										disabled={loading}
									/>
									<BottomSheet modalProps={{}} isVisible={isVisibleBS}>
										{rolesList.map((l, i) => (
											<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
												<ListItem.Content>
													<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
												</ListItem.Content>
											</ListItem>
										))}
									</BottomSheet>
								</View>
							</View>
							<View style={styles.inputsSubmitRow}>
								<Button
									// style={styles.row}
									color={'green'}
									icon={{ name: 'check', color: 'white' }}
									disabled={!driverInput.name || !driverInput.role || loading}
									onPress={addDriverSubmit}
									loading={loading}
								/>
								<Button
									color={'red'}
									icon={{ name: 'cancel', color: 'white' }}
									onPress={cancelHandler}
									disabled={loading}
								/>
							</View>
						</>
					)}
				</View>
			</ScrollView>
			<FAB
				visible={visibleAddButton}
				onPress={addDriverHandler}
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
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	link: {
		display: 'flex',
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
		flex: 1,
		flexDirection: 'row',
		// borderBottomWidth: 1,
		// borderColor: '#ddd',
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		borderBottomWidth: 2, // увеличили толщину линии для заголовка
	},
	cell: {
		flex: 1,
		padding: 10,
		textAlign: 'left', // выравнивание по центру
	},
	cellHeader: {
		padding: 10,
		fontWeight: 'bold', // жирный шрифт
		textAlign: 'left',
	},
	inputsCell: {
		flex: 1,
		flexDirection: 'row',
	},
	inputsSubmitRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
})

const cols = [
	{ key: 'name', label: 'ФИО' },
	{ key: 'phone', label: 'Телефон' },
	{ key: 'nickname', label: 'Псевдоним' },
	{ key: 'comment', label: 'Комментарий' },
	{ key: 'role', label: 'Роль' },
	// { key: 'isActive', label: 'Активен' },
]

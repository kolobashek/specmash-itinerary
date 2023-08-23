import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../store'
import { observer } from 'mobx-react-lite'

export const DriversScreen = observer(() => {
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
	const rolesList = [
		...roles.map((role) => {
			return {
				key: role.id,
				title: role.name,
				containerStyle: { backgroundColor: 'white' },
				titleStyle: { color: 'black' },
				onPress: async () => {
					setDriverInput({ role: role.name })
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
				<View style={{ flex: 1 }}>
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
					{list.map((driver) => {
						return (
							<View key={driver.id} style={[styles.row]}>
								<Text style={styles.cell}>{driver.name}</Text>
								<Text style={styles.cell}>{driver.phone}</Text>
								<Text style={styles.cell}>{driver.nickname}</Text>
								<Text style={styles.cell}>{driver.comment}</Text>
								<Text style={styles.cell}>{driver.role}</Text>
							</View>
						)
					})}
					{!visibleAddButton && (
						<>
							<View style={[styles.row]}>
								<View style={styles.cell}>
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
								<View style={styles.cell}>
									<Input
										placeholder='ФИО'
										value={driverInput.name}
										onChangeText={(e) => setDriverInput({ name: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									<Input
										placeholder='Псевдоним'
										value={driverInput.nickname}
										onChangeText={(e) => setDriverInput({ nickname: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									<Input
										placeholder='Комментарий'
										value={driverInput.comment}
										onChangeText={(e) => setDriverInput({ comment: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.cell}>
									{/* <Input
										placeholder='Активен'
										value={driverInput.isActive}
										onChangeText={(e) => setDriverInput({ isActive: e })}
										disabled={loading}
									/> */}
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
								</View>
								<View style={styles.cell}>
									<Button
										title={driverInput.role || 'Роль'}
										onPress={() => setIsVisibleBS(true)}
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
							<View style={styles.row}>
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
	{ key: 'phone', label: 'Телефон' },
	{ key: 'name', label: 'ФИО' },
	{ key: 'nickname', label: 'Псевдоним' },
	{ key: 'comment', label: 'Комментарий' },
	{ key: 'isActive', label: 'Активен' },
	{ key: 'role', label: 'Роль' },
]

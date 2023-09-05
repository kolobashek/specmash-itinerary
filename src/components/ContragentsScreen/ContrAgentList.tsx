// import React from 'react'
// import { observer } from 'mobx-react-lite'
// import { Button, Text, View } from 'react-native'
// import store from '../../store'

// export const ContragentsScreen = observer(() => {
// 	return (
// 		<View>
// 			<Text>
// 				{store.auth.registrationMessage.length
// 					? store.auth.registrationMessage
// 					: 'Ошибка. Перезагрузите приложение или дождитесь пока его исправят.'}
// 			</Text>

// 			<Button
// 				title='Отменить регистрацию'
// 				onPress={() => {
// 					store.auth.setRegistrationMessage('')
// 				}}
// 			/>
// 		</View>
// 	)
// })
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Avatar } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
// import { DrawerScreenProps } from '@react-navigation/drawer'
import { ContrAgentsStackParamList } from '../../../App'
import { StackScreenProps } from '@react-navigation/stack'
import { Link } from '@react-navigation/native'
import * as Device from 'expo-device'
import { ContrAgentCard } from './ContrAgentCard'

type Props = StackScreenProps<ContrAgentsStackParamList, 'ContrAgentsList'>

export const ContrAgentsList = observer(({ navigation }: Props) => {
	const {
		list,
		contrAgentInput,
		setContrAgentInput,
		createContrAgent,
		clearContrAgentInput,
		getContrAgents,
	} = store.contrAgents
	useEffect(() => {
		getContrAgents()
	}, [])

	const [visibleAddButton, setVisibleAddButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const addContrAgentHandler = async () => {
		setVisibleAddButton(false)
	}
	const addContrAgentSubmit = async () => {
		setLoading(true)
		const newDriver = await createContrAgent()
		if (newDriver instanceof Error) {
			console.log(newDriver)
			setLoading(false)
		}
		setVisibleAddButton(true)
		setLoading(false)
		clearContrAgentInput()
		getContrAgents()
	}
	const cancelHandler = () => {
		setVisibleAddButton(true)
	}
	const isActiveHandler = () => {
		setIsActive(!isActive)
		// setContrAgentInput({ isActive: !isActive })
	}
	// const memoizedRoleName = React.useMemo(() => {
	// 	return (role: string | undefined) => {
	// 		if (role === 'admin') return 'Администратор'
	// 		if (role === 'manager') return 'Менеджер'
	// 		return 'Водитель'
	// 	}
	// }, [])
	// const currentDriver = navigation.getState().routes.find((r) => r.name === 'DriversList')
	// 	?.params?.id
	// const rolesList = [
	// 	...roles.map((role, key) => {
	// 		return {
	// 			key,
	// 			title: memoizedRoleName(role),
	// 			containerStyle: { backgroundColor: 'white' },
	// 			titleStyle: { color: 'black' },
	// 			onPress: async () => {
	// 				setDriverInput({ role })
	// 				setIsVisibleBS(false)
	// 			},
	// 		}
	// 	}),
	// 	{
	// 		title: 'Отмена',
	// 		containerStyle: { backgroundColor: 'red' },
	// 		titleStyle: { color: 'white' },
	// 		onPress: () => {
	// 			setIsVisibleBS(false)
	// 			setVisibleAddButton(true)
	// 		},
	// 	},
	// ]
	const device = Device.DeviceType[Device.deviceType || 0]
	return (
		<>
			<ScrollView stickyHeaderHiddenOnScroll stickyHeaderIndices={[0]}>
				{/* <StickyHeader titles={cols} /> */}
				<View style={styles.table}>
					{list.map((contrAgent) => {
						return (
							<Link
								to={
									device === 'DESKTOP'
										? `/drivers/${contrAgent.id}`
										: { screen: 'DriverDetails', params: { id: contrAgent.id } }
								}
								key={contrAgent.id}
								style={[styles.link]}
							>
								<ListItem bottomDivider style={styles.row} containerStyle={styles.row}>
									<Avatar
										rounded
										title={contrAgent.name?.charAt(0).toUpperCase()}
										containerStyle={{ backgroundColor: 'grey' }}
									/>
									<ListItem.Content>
										<ListItem.Title>{contrAgent.name}</ListItem.Title>
										<ListItem.Subtitle>{contrAgent.address}</ListItem.Subtitle>
										<ListItem.Subtitle>{contrAgent.contacts}</ListItem.Subtitle>
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
										placeholder='Наименование'
										value={contrAgentInput.name}
										onChangeText={(e) => setContrAgentInput({ name: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Контакты'
										value={contrAgentInput.contacts}
										onChangeText={(e) => {
											console.log(e)
											setContrAgentInput({ contacts: e })
										}}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Адрес'
										value={contrAgentInput.address}
										onChangeText={(e) => setContrAgentInput({ address: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									<Input
										placeholder='Комментарий'
										value={contrAgentInput.comment}
										onChangeText={(e) => setContrAgentInput({ comment: e })}
										disabled={loading}
									/>
								</View>
								<View style={styles.inputsCell}>
									{/* <Button
										title={contrAgentInput.role || 'Роль'}
										onPress={() => setIsVisibleBS(true)}
										disabled={loading}
									/> */}
									{/* <Button
										color={isActive ? 'gray' : 'warning'}
										icon={
											isActive
												? { name: 'check', color: 'white' }
												: { name: 'cancel', color: 'white' }
										}
										onPress={isActiveHandler}
										disabled={loading}
									/> */}
									{/* <BottomSheet modalProps={{}} isVisible={isVisibleBS}>
										{rolesList.map((l, i) => (
											<ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
												<ListItem.Content>
													<ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
												</ListItem.Content>
											</ListItem>
										))}
									</BottomSheet> */}
								</View>
							</View>
							<View style={styles.inputsSubmitRow}>
								<Button
									// style={styles.row}
									color={'green'}
									icon={{ name: 'check', color: 'white' }}
									disabled={!contrAgentInput.name || loading}
									onPress={addContrAgentSubmit}
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
				onPress={addContrAgentHandler}
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

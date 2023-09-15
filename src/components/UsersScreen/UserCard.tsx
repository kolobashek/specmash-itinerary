import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StackScreenProps } from '@react-navigation/stack'
import { UsersStackParamList } from '../../../App'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'

type Props = StackScreenProps<UsersStackParamList, 'UserDetails'>

export const UserCard = observer(({ navigation }: Props) => {
	const {
		currentUser,
		setCurrentUser,
		getUserById,
		getUsers,
		updateUser,
		clearUserInput,
		setUserInput,
		roles,
		userInput,
		roleName,
	} = store.users
	const userId = Number(
		navigation.getState().routes.find((r) => r.name === 'UserDetails')?.params?.id
	)
	useEffect(() => {
		const user = async () => {
			const input = await getUserById(userId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setUserInput(input)
		}
		user()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editUserHandler = () => {
		setVisibleEditButton(!visibleEditButton)
	}
	const editUserSubmit = async (id: number) => {
		setLoading(true)
		const newUser = await updateUser({ id, ...userInput })
		if (newUser instanceof Error) {
			console.log(newUser)
			setUpdateError(newUser.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentUser(newUser)
		setVisibleEditButton(true)
		setLoading(false)
		clearUserInput()
		return newUser
	}
	if (!currentUser) return <Text>Что-то пошло не так.</Text>
	if (!visibleEditButton)
		return (
			<>
				<Card>
					<Card.Title>
						{`${currentUser.name}` + (currentUser.nickname ? `, ${currentUser.nickname}` : '')}
					</Card.Title>
					<Card.Divider />
					<View>
						<ListItem>
							<ListItem.Title>Телефон:</ListItem.Title>
							<ListItem.Input
								placeholder='00000000000'
								value={userInput.phone}
								onChangeText={(text) => setUserInput({ phone: text })}
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
								value={userInput.role}
								onChange={(role) => setUserInput({ role: role.value })}
								renderLeftIcon={() => {
									return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
								}}
								renderItem={(item) => {
									return (
										<View style={styles.item}>
											<Text style={styles.textItem}>{item.label}</Text>
											{item.value === userInput.role && (
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
								value={userInput.comment}
								onChangeText={(text) => setUserInput({ comment: text })}
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
					onPress={() => editUserSubmit(userId)}
					placement='left'
					icon={{ name: 'check', color: 'white' }}
					color='green'
				/>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={editUserHandler}
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
					{`${currentUser.name}` + (currentUser.nickname ? `, ${currentUser.nickname}` : '')}
				</Card.Title>
				<Card.Divider />
				<View>
					<ListItem>
						<ListItem.Title>Телефон:</ListItem.Title>
						<ListItem.Subtitle>{`${currentUser.phone}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Роль: </ListItem.Title>
						<ListItem.Subtitle>{`${roleName(currentUser.role)}`}</ListItem.Subtitle>
					</ListItem>
					<ListItem>
						<ListItem.Title>Комментарий:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentUser.comment ? currentUser.comment : ''
						}`}</ListItem.Subtitle>
					</ListItem>
				</View>
			</Card>
			<FAB
				visible={visibleEditButton}
				onPress={editUserHandler}
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

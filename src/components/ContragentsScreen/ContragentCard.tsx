import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IContrAgent } from '../../store/contrAgentStore'
import { StackScreenProps } from '@react-navigation/stack'
import { ContrAgentsStackParamList } from '../../../App'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { useLinkTo } from '@react-navigation/native'

type Props = StackScreenProps<ContrAgentsStackParamList, 'ContrAgentDetails'>

export const ContrAgentCard = observer(({ navigation }: Props) => {
	const linkTo = useLinkTo()
	const {
		currentContrAgent,
		setCurrentContrAgent,
		getContrAgentById,
		getContrAgents,
		updateContrAgent,
		clearContrAgentData,
		setContrAgentData,
		contrAgentData,
	} = store.contrAgents
	const contrAgentId = Number(
		navigation.getState().routes.find((r) => r.name === 'ContrAgentDetails')?.params?.id
	)
	useEffect(() => {
		const contrAgent = async () => {
			const input = await getContrAgentById(contrAgentId)
			if (input instanceof Error) {
				return new Error('Unable to fetch user')
			}
			setContrAgentData(input)
		}
		contrAgent()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const [updateError, setUpdateError] = useState('')

	const editContrAgentHandler = () => {
		linkTo(`/workplaces/contragents/${contrAgentId}/edit`)
	}
	const editContrAgentSubmit = async (id: number) => {
		setLoading(true)
		const newContrAgent = await updateContrAgent({ id, ...contrAgentData })
		if (newContrAgent instanceof Error) {
			console.log(newContrAgent)
			setUpdateError(newContrAgent.message)
			setLoading(false)
			return null
		}
		setUpdateError('')
		setCurrentContrAgent(newContrAgent)
		setVisibleEditButton(true)
		setLoading(false)
		clearContrAgentData()
		return newContrAgent
	}
	// const isActiveHandler = () => {
	// 	setIsActive(!isActive)
	// 	setContrAgentData({ isActive: !isActive })
	// }
	if (!currentContrAgent) return <Text>Что-то пошло не так.</Text>
	if (!visibleEditButton)
		return (
			<>
				<Card>
					<Card.Title>
						{`${contrAgentData.name}` +
							(contrAgentData.objects
								? `, //${contrAgentData.objects.map((obj) => obj.name).join(', ')}`
								: '')}
					</Card.Title>
					<Card.Divider />
					<View>
						{/* <ListItem>
							<ListItem.Title>Телефон:</ListItem.Title>
							<ListItem.Input
								placeholder='00000000000'
								value={contrAgentData.phone}
								onChangeText={(text) => setContrAgentData({ phone: text })}
								disabled={loading}
								style={{ textAlign: 'left' }}
							/>
						</ListItem> */}
						{/* <ListItem>
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
								value={contrAgentInput.role}
								onChange={(role) => setContrAgentInput({ role: role.value })}
								renderLeftIcon={() => {
									return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
								}}
								renderItem={(item) => {
									return (
										<View style={styles.item}>
											<Text style={styles.textItem}>{item.label}</Text>
											{item.value === contrAgentInput.role && (
												<AntDesign style={styles.icon} color='black' name='Safety' size={20} />
											)}
										</View>
									)
								}}
								disable={loading}
							/>
						</ListItem> */}
						<ListItem>
							<ListItem.Title>Адрес:</ListItem.Title>
							<ListItem.Input
								placeholder='Адрес'
								value={contrAgentData.address}
								onChangeText={(text) => setContrAgentData({ address: text })}
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
					onPress={() => editContrAgentSubmit(contrAgentId)}
					placement='left'
					icon={{ name: 'check', color: 'white' }}
					color='green'
				/>
				<FAB
					visible={!visibleEditButton || !loading}
					onPress={editContrAgentHandler}
					placement='right'
					icon={{ name: 'cancel', color: 'white' }}
					color='red'
				/>
			</>
		)
	return (
		<>
			<Card>
				<Card.Title>{`${currentContrAgent.name}`}</Card.Title>
				<Card.Divider />
				<View>
					{/* <ListItem>
						<ListItem.Title>Телефон:</ListItem.Title>
						<ListItem.Subtitle>{`${currentContrAgent.phone}`}</ListItem.Subtitle>
					</ListItem> */}
					{/* <ListItem>
						<ListItem.Title>Роль: </ListItem.Title>
						<ListItem.Subtitle>{`${roleName(currentContrAgent.role)}`}</ListItem.Subtitle>
					</ListItem> */}
					<ListItem>
						<ListItem.Title>Адрес:</ListItem.Title>
						<ListItem.Subtitle>{`${
							currentContrAgent.address ? currentContrAgent.address : ''
						}`}</ListItem.Subtitle>
					</ListItem>
				</View>
			</Card>
			<FAB
				visible={visibleEditButton}
				onPress={editContrAgentHandler}
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

import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IContrAgentData } from '../../store/contrAgentStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ContrAgentsStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { MultiSelect } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { IObject } from '../../store/objectStore'

type Props = {
	contrAgentData: IContrAgentData
	setContrAgentData: (contrAgent: IContrAgentData) => void
	objectVariants: IObject[]
	loading?: boolean
	error?: string
}

export const ContrAgentForm = ({
	contrAgentData,
	setContrAgentData,
	loading,
	error,
	objectVariants,
}: Props) => {
	const [name, setContrAgentName] = useState(contrAgentData.name)
	const [contacts, setContrAgentContacts] = useState(contrAgentData.contacts)
	const [address, setContrAgentAddress] = useState(contrAgentData.address)
	const [comment, setContrAgentComment] = useState(contrAgentData.comment)
	const [objects, setContrAgentObjects] = useState(contrAgentData.objects || [])
	useEffect(() => {
		setContrAgentData({
			...contrAgentData,
			name,
			contacts,
			address,
			comment,
			objects,
		})
	}, [name, contacts, address, comment, objects])
	return (
		<Card>
			<Card.Title>
				{`${contrAgentData.name}` + (contrAgentData.comment ? `, ${contrAgentData.comment}` : '')}
			</Card.Title>
			<Card.Divider />
			<View>
				<ListItem>
					<ListItem.Title>Наименование:</ListItem.Title>
					<ListItem.Input
						placeholder={contrAgentData.name || 'Наименование'}
						value={name}
						onChangeText={setContrAgentName}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Адрес:</ListItem.Title>
					<ListItem.Input
						placeholder='Введите адрес - физический или юридический'
						value={address}
						onChangeText={setContrAgentAddress}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Контакты:</ListItem.Title>
					<ListItem.Input
						placeholder='телефон, email, ФИО, должность'
						value={contacts}
						onChangeText={setContrAgentContacts}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Тип: </ListItem.Title>
					<MultiSelect
						style={styles.dropdown}
						placeholderStyle={styles.placeholderStyle}
						selectedTextStyle={styles.selectedTextStyle}
						inputSearchStyle={styles.inputSearchStyle}
						iconStyle={styles.iconStyle}
						data={objectVariants}
						search
						searchField='name'
						maxHeight={300}
						labelField={'name'}
						valueField={'id'}
						placeholder={'Выберите объекты'}
						searchPlaceholder='Найти...'
						value={objects.map((obj) => obj.name || '')}
						onChange={(value: IObject[]) => {
							console.log(value)
							setContrAgentObjects(value)
						}}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<View style={styles.item}>
									<Text style={styles.textItem}>{item.name}</Text>
									{item.id === contrAgentData.objects?.find((obj) => obj.id === item.id)?.id && (
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
						placeholder={comment || 'Комментарий'}
						value={comment}
						onChangeText={setContrAgentComment}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
			</View>
			{error && (
				<>
					<Card.Divider />
					<Text style={{ color: 'red' }}>{error}</Text>
				</>
			)}
		</Card>
	)
}

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

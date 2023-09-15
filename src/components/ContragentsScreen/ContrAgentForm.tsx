import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IContrAgentData, ContrAgentType } from '../../store/contrAgentStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ContrAgentsStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'

type Props = {
	contrAgentData: IContrAgentData
	setContrAgentData: (contrAgent: IContrAgentData) => void
	types: ContrAgentType[]
	loading?: boolean
	error?: string
}

export const ContrAgentForm = ({
	contrAgentData,
	setContrAgentData,
	types,
	loading,
	error,
}: Props) => {
	const [name, setContrAgentName] = useState(contrAgentData.name)
	const [type, setContrAgentType] = useState(contrAgentData.type)
	const [weight, setContrAgentWeight] = useState(contrAgentData.weight)
	const [nickname, setContrAgentNickname] = useState(contrAgentData.nickname)
	const [licensePlate, setContrAgentLicensePlate] = useState(contrAgentData.licensePlate)
	useEffect(() => {
		setContrAgentData({
			...contrAgentData,
			name,
			type,
			weight,
			nickname,
			licensePlate,
		})
	}, [name, type, weight, nickname, licensePlate])
	return (
		<Card>
			<Card.Title>
				{`${contrAgentData.name}` + (contrAgentData.nickname ? `, ${contrAgentData.nickname}` : '')}
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
					<ListItem.Title>Позывной:</ListItem.Title>
					<ListItem.Input
						placeholder={nickname || 'Позывной'}
						value={nickname}
						onChangeText={setContrAgentNickname}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Вес, кг:</ListItem.Title>
					<ListItem.Input
						placeholder='12000'
						value={weight}
						onChangeText={setContrAgentWeight}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Тип: </ListItem.Title>
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
						placeholder={type || 'Выберите тип'}
						searchPlaceholder='Search...'
						value={contrAgentData.type}
						onChange={(type) => setContrAgentType(type.label)}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<View style={styles.item}>
									<Text style={styles.textItem}>{item.label}</Text>
									{item.label === contrAgentData.type && (
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
						value={licensePlate}
						onChangeText={setContrAgentLicensePlate}
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

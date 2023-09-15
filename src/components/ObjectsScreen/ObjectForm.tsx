import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IObjectData, ObjectType } from '../../store/objectStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ObjectStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'

type Props = {
	objectData: IObjectData
	setObjectData: (object: IObjectData) => void
	types: ObjectType[]
	loading?: boolean
	error?: string
}

export const ObjectForm = ({ objectData, setObjectData, types, loading, error }: Props) => {
	const [name, setObjectName] = useState(objectData.name)
	const [type, setObjectType] = useState(objectData.type)
	const [weight, setObjectWeight] = useState(objectData.weight)
	const [nickname, setObjectNickname] = useState(objectData.nickname)
	const [licensePlate, setObjectLicensePlate] = useState(objectData.licensePlate)
	useEffect(() => {
		setObjectData({
			...objectData,
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
				{`${objectData.name}` + (objectData.nickname ? `, ${objectData.nickname}` : '')}
			</Card.Title>
			<Card.Divider />
			<View>
				<ListItem>
					<ListItem.Title>Наименование:</ListItem.Title>
					<ListItem.Input
						placeholder={objectData.name || 'Наименование'}
						value={name}
						onChangeText={setObjectName}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Позывной:</ListItem.Title>
					<ListItem.Input
						placeholder={nickname || 'Позывной'}
						value={nickname}
						onChangeText={setObjectNickname}
						disabled={loading}
						style={{ textAlign: 'left' }}
					/>
				</ListItem>
				<ListItem>
					<ListItem.Title>Вес, кг:</ListItem.Title>
					<ListItem.Input
						placeholder='12000'
						value={weight}
						onChangeText={setObjectWeight}
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
						value={objectData.type}
						onChange={(type) => setObjectType(type.label)}
						renderLeftIcon={() => {
							return <AntDesign style={styles.icon} color='black' name='Safety' size={20} />
						}}
						renderItem={(item) => {
							return (
								<View style={styles.item}>
									<Text style={styles.textItem}>{item.label}</Text>
									{item.label === objectData.type && (
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
						onChangeText={setObjectLicensePlate}
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

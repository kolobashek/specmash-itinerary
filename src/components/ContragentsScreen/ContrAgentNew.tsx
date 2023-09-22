import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FAB, Input, BottomSheet, Button, ListItem, Text, Card } from '@rneui/themed'
import DateTimePicker from '@react-native-community/datetimepicker'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { StickyHeader } from '../UIkit'
import { localizedRoleName } from '../../utils'
import { IContrAgent } from '../../store/contrAgentStore'
import { useLinkTo } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ContrAgentsStackParamList } from '../../../App'
import * as Device from 'expo-device'
import { get } from 'http'
import { Dropdown } from 'react-native-element-dropdown'
import { AntDesign } from '@expo/vector-icons'
import { ContrAgentForm } from './ContrAgentForm'
import { IObject } from '../../store/objectStore'

type Props = StackScreenProps<ContrAgentsStackParamList, 'ContrAgentNew'>

export const ContrAgentNew = observer(({ navigation }: Props) => {
	const linkTo = useLinkTo()
	const { createContrAgent, clearContrAgentData, setContrAgentData, contrAgentData } =
		store.contrAgents
	const [allObjects, setAllObjects] = useState([] as IObject[])
	const { getObjects } = store.objects
	useEffect(() => {
		const start = async () => {
			const objectsFromApi = await getObjects()
			if (objectsFromApi instanceof Error) {
				return
			}
			setAllObjects(objectsFromApi)
		}
		start()
	}, [])
	const [loading, setLoading] = useState(false)
	const [updateError, setCreateError] = useState('')

	const cancelHandler = (e: any) => {
		e.preventDefault()
		navigation.goBack()
	}
	const createContrAgentSubmit = async (e: any) => {
		e.preventDefault()
		setLoading(true)
		const createdContrAgent = await createContrAgent(contrAgentData)
		if (createdContrAgent instanceof Error) {
			console.log(createdContrAgent)
			setCreateError(createdContrAgent.message)
			setLoading(false)
			return createdContrAgent
		}
		clearContrAgentData()
		setCreateError('')
		setLoading(false)
		return linkTo(`/contrAgents/${createdContrAgent.id}`)
	}
	if (loading) return <Text>Loading...</Text>
	return (
		<>
			<ContrAgentForm
				contrAgentData={contrAgentData}
				setContrAgentData={setContrAgentData}
				error={updateError}
				loading={loading}
				objectVariants={allObjects}
			/>
			<FAB
				visible={!loading}
				onPress={createContrAgentSubmit}
				placement='left'
				icon={{ name: 'check', color: 'white' }}
				color='green'
			/>
			<FAB
				visible={!loading}
				onPress={cancelHandler}
				placement='right'
				icon={{ name: 'cancel', color: 'white' }}
				color='red'
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

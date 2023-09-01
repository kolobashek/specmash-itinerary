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

type Props = StackScreenProps<DriversStackParamList, 'DriverDetails'>

export const DriverCard = observer(({ navigation }: Props) => {
	const {
		currentDriver,
		getUserById,
		getDrivers,
		updateDriver,
		list,
		clearDriverInput,
		setDriverInput,
		roles,
		driverInput,
	} = store.drivers
	useEffect(() => {
		getDrivers()
	}, [])
	useEffect(() => {
		const user = async () => {
			await getUserById(
				Number(navigation.getState().routes.find((r) => r.name === 'DriverDetails')?.params?.id)
			)
		}
		user()
	}, [])

	const [visibleEditButton, setVisibleEditButton] = useState(true)
	const [loading, setLoading] = useState(false)
	const [isVisibleBS, setIsVisibleBS] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const editDriverHandler = async () => {
		setVisibleEditButton(false)
	}
	const editDriverSubmit = async (id: number) => {
		setLoading(true)
		const newDriver = await updateDriver({ id, ...driverInput })
		if (newDriver instanceof Error) {
			console.log(newDriver)
			setLoading(false)
		}
		setVisibleEditButton(true)
		setLoading(false)
		clearDriverInput()
		getDrivers()
		return newDriver
	}
	const cancelHandler = () => {
		setVisibleEditButton(true)
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
	return (
		<>
			<Card>
				<Card.Title>Driver card id={currentDriver.id}</Card.Title>
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
})

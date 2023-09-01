import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Text, View } from 'react-native'
import store from '../../store'

export const ContragentsScreen = observer(() => {
	return (
		<View>
			<Text>
				{store.auth.registrationMessage.length
					? store.auth.registrationMessage
					: 'Ошибка. Перезагрузите приложение или дождитесь пока его исправят.'}
			</Text>

			<Button
				title='Отменить регистрацию'
				onPress={() => {
					store.auth.setRegistrationMessage('')
				}}
			/>
		</View>
	)
})

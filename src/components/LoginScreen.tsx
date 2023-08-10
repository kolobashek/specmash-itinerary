import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Card } from '@rneui/themed'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useManualQuery } from 'graphql-hooks'
// Import { loginUser } from '../services/api/auth'
import Queries from '../services/api/queries'

// Import { login } from '../api/auth'; // добавлен

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginScreen = ({ route, navigation }: { route: any; navigation: any }) => {
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const [loginUser] = useManualQuery(Queries.login)

	const handleLogin = async () => {
		const variables = { phone, password }

		try {
			const FetchedData = await loginUser({ variables })
			console.log('FetchedData', FetchedData)
			const loading = FetchedData.loading
			console.log('loading', loading)
			const user = FetchedData.data
			const error = FetchedData.error
			console.log(user, error)
		} catch (catchedError) {
			setPassword('')
			console.log('catchedError', catchedError)
		}
	}

	return (
		<View style={styles.container}>
			<Card>
				<Card.Title>ВХОД</Card.Title>
				<Input
					containerStyle={{}}
					// DisabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={{}}
					errorMessage={''}
					errorStyle={{}}
					errorProps={{}}
					inputStyle={styles.inputStyle}
					label='Вход:'
					value={phone}
					labelStyle={{}}
					labelProps={{}}
					leftIcon={<Icon name='phone-outline' size={20} />}
					leftIconContainerStyle={{}}
					rightIcon={
						<Icon
							name='close'
							color={phone.length ? '#000' : '#ddd'}
							size={20}
							onPress={() => setPhone('')}
							aria-hidden={!phone.length}
						/>
					}
					rightIconContainerStyle={{}}
					placeholder='Введите номер'
					onChangeText={setPhone}
					// disabled={loading}
				/>
				<Input
					containerStyle={{}}
					// DisabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={{}}
					errorMessage={errorMessage}
					errorStyle={{}}
					errorProps={{}}
					inputStyle={styles.inputStyle}
					labelStyle={{}}
					labelProps={{}}
					leftIconContainerStyle={{}}
					rightIcon={
						<Icon
							name='close'
							color={password.length ? '#000' : '#ddd'}
							size={20}
							style={styles.passIcon}
							onPress={() => setPassword('')}
							aria-hidden={!password.length}
						/>
					}
					rightIconContainerStyle={{}}
					placeholder='Введите пароль'
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					// disabled={loading}
				/>
				<Button
					title='Войти'
					onPress={handleLogin}
					// disabled={loading}
				/>

				<Button
					title='Зарегистрироваться'
					onPress={() => {
						navigation.navigate('Register')
					}}
					type='clear'
				/>
			</Card>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		// Flex: 1,
		marginTop: '2%',
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 300,
		maxWidth: 400,
		marginHorizontal: 'auto',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	inputContainer: {
		width: '80%',
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#777',
		padding: 8,
		marginBottom: 10,
		width: '100%',
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	linkButton: {},
	passIcons: {
		flexDirection: 'row',
	},
	inputStyle: {
		paddingLeft: 20,
		fontSize: 12,
	},
	passIcon: {
		paddingLeft: 5,
	},
})

export { LoginScreen }

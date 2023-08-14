import React, { useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Card } from '@rneui/themed'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useMutation, ClientContext, useQuery } from 'graphql-hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Queries, { handleApiError, APIErrors } from '../services/api/queries'
import store from '../store'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginScreen = ({ route, navigation }: { route: any; navigation: any }) => {
	const client = useContext(ClientContext)
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const [loginUser] = useMutation(Queries.login)
	const { data } = useQuery(Queries.me)

	const handleLogin = async () => {
		const variables = { phone, password }

		try {
			const FetchedData = await loginUser({ variables })
			console.log('FetchedData', FetchedData)
			const loading = FetchedData.loading
			const error = FetchedData.error
			const { login } = FetchedData.data
			if (error) {
				const message = handleApiError(error as APIErrors)
				setErrorMessage(message)
				setPassword('')
				return
			}
			if (!loading) {
				const { token } = login
				await AsyncStorage.setItem('token', token)
				client?.setHeader('Authorization', `Bearer ${token}`)
				if (!error && data.me) {
					store.setUserData(data.me)
					store.setUserAuthorized(true)
					navigation.navigate('Table')
				}
				console.log('token', token)
			}
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
					onChangeText={(e) => {
						setPassword(e), setErrorMessage('')
					}}
					onSubmitEditing={handleLogin}
					secureTextEntry
					// disabled={loading}
				/>
				<Button title='Войти' onPress={handleLogin} disabled={!phone.length || !password.length} />

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

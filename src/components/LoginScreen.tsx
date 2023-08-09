import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Card } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { type StackNavigationProp } from '@react-navigation/stack'
import { useManualQuery } from 'graphql-hooks'
import { type RootStackParamList } from '../../App'
// Import { loginUser } from '../services/api/auth'
import Queries from '../services/api/queries'

// Import { login } from '../api/auth'; // добавлен

const LoginScreen = () => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [loginUser, { loading, error, data }] = useManualQuery(Queries.login, {
		variables: {
			phone,
			password,
		},
	})

	// Const handleLogin = async () => {
	//   try {
	//     // await loginUser({ phone, password })

	//     // навигация на экран после успешного входа
	//     navigation.navigate('Home')
	//   } catch (error: any) {
	//     Alert.alert('Ошибка', error.message)
	//   }
	// }
	const handleLogin = async () => {
		const variables = { phone, password }
		await loginUser({ variables })
		console.log(data)
	}

	return (
		<View style={styles.container}>
			<Card>
				<Card.Title>ВХОД</Card.Title>
				<Input
					containerStyle={{}}
					// DisabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={{}}
					errorMessage={error?.httpError?.body ?? error?.fetchError?.message}
					errorStyle={{}}
					errorProps={{}}
					inputStyle={{}}
					label='Вход:'
					labelStyle={{}}
					labelProps={{}}
					leftIcon={<Icon name='phone-outline' size={20} />}
					leftIconContainerStyle={{}}
					rightIcon={<Icon name='close' size={20} />}
					rightIconContainerStyle={{}}
					placeholder='Введите номер'
					onChangeText={setPhone}
				/>
				<Input
					containerStyle={{}}
					// DisabledInputStyle={{ background: '#ddd' }}
					inputContainerStyle={styles.inputContainerStyle}
					errorMessage="Oops! that's not correct."
					errorStyle={{}}
					errorProps={{}}
					inputStyle={{}}
					labelStyle={{}}
					labelProps={{}}
					leftIconContainerStyle={{}}
					rightIcon={
						<View style={styles.passIcons}>
							<Icon name='eye-outline' size={20} style={styles.passIcon} />
							<Icon name='close' size={20} style={styles.passIcon} />
						</View>
					}
					rightIconContainerStyle={{}}
					placeholder='Введите пароль'
					onChangeText={setPassword}
					secureTextEntry
				/>
				<Button title='Войти' onPress={handleLogin} />

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
	inputContainerStyle: {},
	passIcon: {
		paddingLeft: 5,
	},
})

export { LoginScreen }

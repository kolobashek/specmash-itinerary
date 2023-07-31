import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert, // добавлен
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { loginUser } from '../services/api/auth'

// import { login } from '../api/auth'; // добавлен

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await loginUser({ phone, password })

      // навигация на экран после успешного входа
      navigation.navigate('Home')
    } catch (error: any) {
      Alert.alert('Ошибка', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войти</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Телефон</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Button title="Войти" onPress={handleLogin} />

      <Button
        title="Зарегистрироваться"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export { LoginScreen };

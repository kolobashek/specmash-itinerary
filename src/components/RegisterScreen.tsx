import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { registerUser } from '../services/api/auth'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Регистрация</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Имя</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Телефон</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            inputMode='tel'
          />
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

        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Пользователь" value="user" />
          <Picker.Item label="Админ" value="admin" />
        </Picker>

        <Button
          title="Зарегистрироваться"
          onPress={() => registerUser({ name, phone, password, role })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 4,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
  },

  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
})

export { RegisterScreen }

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert, // добавлен
} from "react-native";

import { useNavigation } from "@react-navigation/native"; // добавлен

// import { login } from '../api/auth'; // добавлен

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войти</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Эл. почта</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
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
      <Button
        title="Войти"
        onPress={async () => {
          // // логика входа
          // // вызов API для входа
          // try {
          //   await login(email, password);
          //   // успешный вход
          //   navigation.navigate("Home");
          // } catch (error) {
          //   // ошибка входа
          //   Alert.alert("Ошибка", error.message);
          // }
        }}
      />
      <Button
        title="Зарегистрироваться"
        onPress={() => {
          // navigation.navigate("Register");
        }}
      />
    </View>
  );
};

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

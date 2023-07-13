import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { registerUser } from "../services/api/user";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const user = { phone, name, password };
    const data = await registerUser(user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Имя</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Эл. почта</Text>
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
      <Button title="Зарегистрироваться" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Стили здесь
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

export { RegisterScreen };

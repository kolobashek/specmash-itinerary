import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";

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
      <Button title="Войти" onPress={() => console.log("Login pressed")} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Стили здесь
});

export { LoginScreen };

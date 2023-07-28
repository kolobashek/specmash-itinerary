import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import store from "./src/store";
import { RegisterScreen, LoginScreen, TableScreen } from "./src/components";

const Stack = createStackNavigator();
const REGISTER_SCREEN = "Register";
const LOGIN_SCREEN = "Login";
console.log("first!!!");

// Проверяем авторизацию пользователя
const isAuthorized = store.getUserAuthorized();

const App = observer(() => {
  console.log(isAuthorized);
  // Если пользователь авторизован, рендерим экран таблицы
  if (isAuthorized) {
    return <TableScreen />;
  }
  // Иначе рендерим экраны регистрации и авторизации
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
        <Stack.Screen name={REGISTER_SCREEN} component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;

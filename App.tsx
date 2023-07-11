import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from "mobx-react-lite";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import store from "./src/store";
import { RegisterScreen, LoginScreen, TableScreen } from "./screens";

const Stack = createStackNavigator();
const REGISTER_SCREEN = "Register";
const LOGIN_SCREEN = "Login";
const TABLE_SCREEN = "Home";

const evrey = 3;

const App = observer(() => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={TABLE_SCREEN} component={TableScreen} />
        <Stack.Screen name={REGISTER_SCREEN} component={RegisterScreen} />
        <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

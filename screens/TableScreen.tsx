import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

const TableScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Таблица пользователей</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Имя</Text>
          <Text style={styles.cell}>Возраст</Text>
          <Text style={styles.cell}>Адрес</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Иван</Text>
          <Text style={styles.cell}>30</Text>
          <Text style={styles.cell}>Москва</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Петр</Text>
          <Text style={styles.cell}>25</Text>
          <Text style={styles.cell}>Санкт-Петербург</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
  },
  table: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 10,
  },
});

export { TableScreen };

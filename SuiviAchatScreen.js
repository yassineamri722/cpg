import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SuiviAchatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase Tracking</Text>
      <Text style={styles.text}>Track purchase history for each supplier and article.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SuiviAchatScreen;

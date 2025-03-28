import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SuiviVenteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi Ventes</Text>
      <Text style={styles.text}>Track the sales history for each client and product.</Text>
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

export default SuiviVenteScreen;

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function FournisseurScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fournisseur</Text>

      {/* Bouton vers Suivi Achat */}
      <Button
        title="suivi achat"
        onPress={() => navigation.navigate("SuiviAchat")}
      />
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
});

export default FournisseurScreen;

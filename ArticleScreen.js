import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function ArticleScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Article</Text>

      {/* Bouton pour aller vers Fournisseurs */}
      <Button
        title="Fournisseur"
        onPress={() => navigation.navigate("Fournisseur")}
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

export default ArticleScreen;

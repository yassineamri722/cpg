import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// Liste des utilisateurs avec des informations supplémentaires
const profiles = [
  { id: "1", name: "Alice Doe", role: "Software Engineer" },
  { id: "2", name: "Bob Smith", role: "Product Manager" },
  { id: "3", name: "Charlie Brown", role: "UX Designer" },
  { id: "4", name: "David Johnson", role: "Data Analyst" },
];

function ProfilesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProfilesScreen;

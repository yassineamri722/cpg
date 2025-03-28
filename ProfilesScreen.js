import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const profiles = [
  { id: "1", title: "Software Engineer", experience: "3 years" },
  { id: "2", title: "Data Scientist", experience: "2 years" },
];

function ProfilesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.experience}>{item.experience} of experience</Text>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  experience: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProfilesScreen;

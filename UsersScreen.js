import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";

function UserScreen() {
  const [users, setUsers] = useState([]);
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setMatricule("");
    setNom("");
    setEditing(null);
  };

  const handleCreateOrUpdateUser = () => {
    if (!matricule || !nom) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const parsedMatricule = parseInt(matricule);
    if (isNaN(parsedMatricule)) {
      Alert.alert("Erreur", "Le matricule doit être un entier.");
      return;
    }

    const userRef = ref(database, `users/${parsedMatricule}`);
    set(userRef, {
      matricule_user: parsedMatricule,
      nom: nom.trim(),
    })
      .then(() => {
        Alert.alert("Succès", editing ? "Utilisateur mis à jour." : "Utilisateur créé.");
        resetForm();
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement :", error);
        Alert.alert("Erreur", "Impossible d'enregistrer l'utilisateur.");
      });
  };

  const handleDeleteUser = (matricule_user) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cet utilisateur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const userRef = ref(database, `users/${matricule_user}`);
            remove(userRef)
              .then(() => {
                Alert.alert("Succès", "Utilisateur supprimé.");
              })
              .catch((error) => {
                console.error("Erreur de suppression :", error);
                Alert.alert("Erreur", "Impossible de supprimer l'utilisateur.");
              });
          },
        },
      ]
    );
  };

  const handleEditUser = (user) => {
    setMatricule(String(user.matricule_user));
    setNom(user.nom);
    setEditing(user.matricule_user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Employés</Text>

      <TextInput
        style={styles.input}
        placeholder="Matricule (entier)"
        value={matricule}
        keyboardType="numeric"
        onChangeText={setMatricule}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />

      <Button
        title={editing ? "Mettre à jour l'utilisateur" : "Créer un utilisateur"}
        onPress={handleCreateOrUpdateUser}
      />

      {editing && (
        <Button
          title="Annuler la modification"
          color="gray"
          onPress={resetForm}
        />
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.matricule_user.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>
              {item.matricule_user} - {item.nom}
            </Text>
            <View style={styles.buttonGroup}>
              <Button title="Modifier" onPress={() => handleEditUser(item)} />
              <Button
                title="Supprimer"
                color="red"
                onPress={() => handleDeleteUser(item.matricule_user)}
              />
            </View>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  userItem: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  userText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default UserScreen;
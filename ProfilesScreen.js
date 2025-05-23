import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";

export default function ProfileScreen() {
  const [profiles, setProfiles] = useState([]);
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, 'profiles');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setProfiles(list);
      } else {
        setProfiles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    if (!code || !libelle) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const codeNum = parseInt(code);
    if (isNaN(codeNum)) {
      Alert.alert("Code invalide", "Le code doit être un entier.");
      return;
    }

    const profileRef = ref(database, `profiles/${codeNum}`);
    set(profileRef, {
      code_profile: codeNum,
      libelle_profile: libelle.trim()
    })
      .then(() => {
        Alert.alert("Succès", editing ? "Profil modifié." : "Profil ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  const handleEdit = (profile) => {
    setCode(profile.code_profile.toString());
    setLibelle(profile.libelle_profile);
    setEditing(profile.code_profile);
  };

  const handleDelete = (code_profile) => {
    Alert.alert("Confirmation", "Supprimer ce profil ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () => {
          const profileRef = ref(database, `profiles/${code_profile}`);
          remove(profileRef)
            .then(() => Alert.alert("Profil supprimé"))
            .catch(err => console.error("Erreur suppression :", err));
        }
      }
    ]);
  };

  const resetForm = () => {
    setCode('');
    setLibelle('');
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Profils</Text>

      <TextInput
        style={styles.input}
        placeholder="Code du profil"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Libellé du profil"
        value={libelle}
        onChangeText={setLibelle}
      />

      <Button title={editing ? "Modifier le profil" : "Ajouter le profil"} onPress={handleSave} />
      {editing && <Button title="Annuler" color="gray" onPress={resetForm} />}

      <FlatList
        data={profiles}
        keyExtractor={item => item.code_profile.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.code_profile} - {item.libelle_profile}
            </Text>
            <View style={styles.buttonGroup}>
              <Button title="Modifier" onPress={() => handleEdit(item)} />
              <Button title="Supprimer" color="red" onPress={() => handleDelete(item.code_profile)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  item: { padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginTop: 15 },
  itemText: { fontSize: 16, marginBottom: 10 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between" },
});



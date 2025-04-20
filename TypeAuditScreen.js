import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";

export default function TypeAuditScreen() {
  const [types, setTypes] = useState([]);
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, 'type_audit');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setTypes(list);
      } else {
        setTypes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    if (!code || !libelle) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const typeRef = ref(database, `type_audit/${code}`);
    set(typeRef, {
      code_audit: code.trim(),
      lib_audit: libelle.trim()
    })
      .then(() => {
        Alert.alert("Succès", editing ? "Type audit modifié." : "Type audit ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  const handleEdit = (item) => {
    setCode(item.code_audit);
    setLibelle(item.lib_audit);
    setEditing(item.code_audit);
  };

  const handleDelete = (code) => {
    Alert.alert("Confirmation", "Supprimer ce type d'audit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () => {
          const typeRef = ref(database, `type_audit/${code}`);
          remove(typeRef)
            .then(() => Alert.alert("Type audit supprimé"))
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
      <Text style={styles.title}>Ajouter Type Audit</Text>

      <TextInput
        style={styles.input}
        placeholder="Code"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Libellé"
        value={libelle}
        onChangeText={setLibelle}
      />

      <Button title={editing ? "Modifier" : "Ajouter"} onPress={handleSave} />
      {editing && <Button title="Annuler" color="gray" onPress={resetForm} />}

      <FlatList
        data={types}
        keyExtractor={item => item.code_audit}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.code_audit} - {item.lib_audit}</Text>
            <View style={styles.buttonGroup}>
              <Button title="Modifier" onPress={() => handleEdit(item)} />
              <Button title="Supprimer" color="red" onPress={() => handleDelete(item.code_audit)} />
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

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";
import styles from "./globalStyles";

export default function TypeAuditScreen()
{
  // States to manage the list, input fields, and editing state
  const [types, setTypes] = useState([]);
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [editing, setEditing] = useState(null);

  // Effect hook to fetch the types from the database
  useEffect(() =>
  {
    const dbRef = ref(database, 'type_audit');
    const unsubscribe = onValue(dbRef, snapshot =>
    {
      const data = snapshot.val();
      if (data)
      {
        // Transform the data into an array and update state
        const list = Object.values(data);
        setTypes(list);
      } else
      {
        setTypes([]);
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  // Handle saving or updating the type of audit
  const handleSave = () =>
  {
    if (!code || !libelle)
    {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const typeRef = ref(database, `type_audit/${code.trim()}`);
    set(typeRef, {
      code_audit: code.trim(),
      lib_audit: libelle.trim(),
    })
      .then(() =>
      {
        Alert.alert("Succès", editing ? "Type audit modifié." : "Type audit ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  // Handle editing an existing type of audit
  const handleEdit = (item) =>
  {
    setCode(item.code_audit);
    setLibelle(item.lib_audit);
    setEditing(item.code_audit);
  };

  // Handle deleting a type of audit with confirmation
  const handleDelete = (code) =>
  {
    Alert.alert("Confirmation", "Supprimer ce type d'audit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () =>
        {
          const typeRef = ref(database, `type_audit/${code}`);
          remove(typeRef)
            .then(() => Alert.alert("Succès", "Type audit supprimé"))
            .catch(err => console.error("Erreur suppression :", err));
        }
      }
    ]);
  };

  // Reset the form fields
  const resetForm = () =>
  {
    setCode('');
    setLibelle('');
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editing ? "Modifier Type Audit" : "Ajouter Type Audit"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Code"
        value={code}
        onChangeText={setCode}
        editable={!editing} // Disable input if editing
      />
      <TextInput
        style={styles.input}
        placeholder="Libellé"
        value={libelle}
        onChangeText={setLibelle}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
        <Text style={styles.btnText}>{editing ? "Modifier" : "Ajouter"}</Text>
      </TouchableOpacity>

      {editing && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={types}
        keyExtractor={item => item.code_audit}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.code_audit} - {item.lib_audit}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.code_audit)}>
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

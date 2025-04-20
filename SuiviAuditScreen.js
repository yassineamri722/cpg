import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";

export default function SuiviAuditScreen() {
  const [suivis, setSuivis] = useState([]);
  const [auditCode, setAuditCode] = useState('');
  const [dateAudit, setDateAudit] = useState('');
  const [auditeur, setAuditeur] = useState('');
  const [resAudit, setResAudit] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, 'suivi_audit');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setSuivis(list);
      } else {
        setSuivis([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    if (!auditCode || !dateAudit || !auditeur || !resAudit) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const suiviRef = ref(database, `suivi_audit/${auditCode}`);
    set(suiviRef, {
      code_audit: auditCode.trim(),
      date_audit: dateAudit.trim(),
      auditeur: auditeur.trim(),
      res_audit: resAudit.trim()
    })
      .then(() => {
        Alert.alert("Succès", editing ? "Suivi audit modifié." : "Suivi audit ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  const handleEdit = (item) => {
    setAuditCode(item.code_audit);
    setDateAudit(item.date_audit);
    setAuditeur(item.auditeur);
    setResAudit(item.res_audit);
    setEditing(item.code_audit);
  };

  const handleDelete = (code_audit) => {
    Alert.alert("Confirmation", "Supprimer ce suivi d'audit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () => {
          const suiviRef = ref(database, `suivi_audit/${code_audit}`);
          remove(suiviRef)
            .then(() => Alert.alert("Suivi audit supprimé"))
            .catch(err => console.error("Erreur suppression :", err));
        }
      }
    ]);
  };

  const resetForm = () => {
    setAuditCode('');
    setDateAudit('');
    setAuditeur('');
    setResAudit('');
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi Audit</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Audit"
        value={auditCode}
        onChangeText={setAuditCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Date Audit"
        value={dateAudit}
        onChangeText={setDateAudit}
      />
      <TextInput
        style={styles.input}
        placeholder="Auditeur"
        value={auditeur}
        onChangeText={setAuditeur}
      />
      <TextInput
        style={styles.input}
        placeholder="Résultats Audit"
        value={resAudit}
        onChangeText={setResAudit}
      />

      <Button title={editing ? "Modifier" : "Ajouter"} onPress={handleSave} />
      {editing && <Button title="Annuler" color="gray" onPress={resetForm} />}

      <FlatList
        data={suivis}
        keyExtractor={(item) => item.code_audit || Math.random().toString(36).substr(2, 9)} // Ensure uniqueness
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.code_audit} - {item.date_audit} - {item.auditeur} - {item.res_audit}
            </Text>
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

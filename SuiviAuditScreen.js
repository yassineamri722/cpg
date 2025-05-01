import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";
import styles from "./globalStyles";

export default function SuiviAuditScreen()
{
  const [suivis, setSuivis] = useState([]);
  const [auditCode, setAuditCode] = useState('');
  const [dateAudit, setDateAudit] = useState('');
  const [auditeur, setAuditeur] = useState('');
  const [resAudit, setResAudit] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() =>
  {
    const dbRef = ref(database, 'suivi_audit');
    const unsubscribe = onValue(dbRef, snapshot =>
    {
      const data = snapshot.val();
      if (data)
      {
        const list = Object.entries(data).map(([key, value]) => ({
          ...value,
          code_audit: key,
        }));
        setSuivis(list);
      } else
      {
        setSuivis([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = () =>
  {
    if (!auditCode || !dateAudit || !auditeur || !resAudit)
    {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const suiviRef = ref(database, `suivi_audit/${auditCode.trim()}`);
    set(suiviRef, {
      date_audit: dateAudit.trim(),
      auditeur: auditeur.trim(),
      res_audit: resAudit.trim()
    })
      .then(() =>
      {
        Alert.alert("Succès", editing ? "Suivi audit modifié." : "Suivi audit ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  const handleEdit = (item) =>
  {
    setAuditCode(item.code_audit);
    setDateAudit(item.date_audit);
    setAuditeur(item.auditeur);
    setResAudit(item.res_audit);
    setEditing(item.code_audit);
  };

  const handleDelete = (code_audit) =>
  {
    Alert.alert("Confirmation", "Supprimer ce suivi d'audit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () =>
        {
          const suiviRef = ref(database, `suivi_audit/${code_audit}`);
          remove(suiviRef)
            .then(() => Alert.alert("Suivi audit supprimé"))
            .catch(err => console.error("Erreur suppression :", err));
        }
      }
    ]);
  };

  const resetForm = () =>
  {
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

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
        <Text style={styles.btnText}>{editing ? "Modifier" : "Ajouter"}</Text>
      </TouchableOpacity>

      {editing && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={suivis}
        keyExtractor={(item) => item.code_audit}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.code_audit} - {item.date_audit} - {item.auditeur} - {item.res_audit}
            </Text>
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

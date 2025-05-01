import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { ref, set, onValue, remove } from "firebase/database";
import { database } from "./firebaseconfig";
import styles from "./globalStyles";

export default function UserScreen()
{
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [matriculeUser, setMatriculeUser] = useState('');
  const [role, setRole] = useState('');
  const [modificationMode, setModificationMode] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() =>
  {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, snapshot =>
    {
      const data = snapshot.val();
      if (data)
      {
        const list = Object.entries(data).map(([key, value]) => ({ key, ...value }));
        setUsers(list);
      } else
      {
        setUsers([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const validateInputs = () =>
  {
    if (!email || !matriculeUser || !role)
    {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return false;
    }
    return true;
  };

  const resetForm = () =>
  {
    setEmail('');
    setMatriculeUser('');
    setRole('');
    setModificationMode(false);
    setEditingKey(null);
  };

  const handleAddOrUpdateUser = async () =>
  {
    if (!validateInputs()) return;

    try
    {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      const data = snapshot.val();

      const emailUsed = data && Object.entries(data).some(
        ([key, user]) => user.email === email && key !== matriculeUser
      );

      if (emailUsed)
      {
        Alert.alert("Erreur", "Cet email est déjà utilisé par un autre utilisateur.");
        return;
      }

      const userRef = ref(database, `users/${matriculeUser}`);
      await set(userRef, {
        email,
        matricule_user: matriculeUser,
        role
      });

      Alert.alert("Succès", modificationMode ? "Utilisateur modifié." : "Utilisateur ajouté.");
      resetForm();
    } catch (error)
    {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder l'utilisateur.");
    }
  };

  const handleEditUser = (item) =>
  {
    setEmail(item.email);
    setMatriculeUser(item.matricule_user);
    setRole(item.role);
    setEditingKey(item.key);
    setModificationMode(true);
  };

  const handleDeleteUser = async (userKey) =>
  {
    try
    {
      await remove(ref(database, `users/${userKey}`));
      Alert.alert("Succès", "Utilisateur supprimé.");
    } catch (error)
    {
      console.error("Erreur suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer l'utilisateur.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {modificationMode ? "✏️ Modifier Utilisateur" : " Ajouter employee"}
      </Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Matricule"
        value={matriculeUser}
        onChangeText={setMatriculeUser}
        keyboardType="numeric"
        editable={!modificationMode}
      />
      <TextInput style={styles.input} placeholder="Rôle" value={role} onChangeText={setRole} />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleAddOrUpdateUser}>
        <Text style={styles.btnText}>{modificationMode ? "Modifier" : "Ajouter"}</Text>
      </TouchableOpacity>

      {modificationMode && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>📋 Liste des utilisateurs</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>📧 {item.email}</Text>
            <Text style={styles.cardText}>🆔 {item.matricule_user}</Text>
            <Text style={styles.cardText}>🔖 {item.role}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEditUser(item)}>
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(item.key)}>
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}


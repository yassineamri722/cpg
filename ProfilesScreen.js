import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity } from "react-native";
import { ref, set, onValue, get, remove } from "firebase/database";
import { database } from "./firebaseconfig";
import styles from "./globalStyles";

export default function ProfileScreen()
{
  const [profiles, setProfiles] = useState([]);
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [modificationMode, setModificationMode] = useState(false);

  useEffect(() =>
  {
    const dbRef = ref(database, 'profiles');
    const unsubscribe = onValue(dbRef, snapshot =>
    {
      const data = snapshot.val();
      if (data)
      {
        const list = Object.values(data);
        setProfiles(list);
      } else
      {
        setProfiles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const validateInputs = () =>
  {
    if (!code || !libelle)
    {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return false;
    }

    const codeNum = parseInt(code);
    if (isNaN(codeNum))
    {
      Alert.alert("Erreur", "Le code doit être un entier.");
      return false;
    }

    return true;
  };

  const resetForm = () =>
  {
    setCode('');
    setLibelle('');
    setModificationMode(false);
  };

  const handleAddOrUpdateProfile = async () =>
  {
    if (!validateInputs()) return;

    const codeNum = parseInt(code);

    try
    {
      // Vérifier si le profil avec ce code existe
      const profileSnap = await get(ref(database, `profiles/${codeNum}`));
      if (!profileSnap.exists())
      {
        Alert.alert("Erreur", `Aucun profil avec le code ${codeNum}`);
        return;
      }

      const profileRef = ref(database, `profiles/${codeNum}`);
      await set(profileRef, {
        code_profile: codeNum,
        libelle_profile: libelle.trim()
      });

      Alert.alert("Succès", modificationMode ? "Profil modifié." : "Profil ajouté.");
      resetForm();

    } catch (error)
    {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  const handleEditProfile = (item) =>
  {
    setCode(item.code_profile.toString());
    setLibelle(item.libelle_profile);
    setModificationMode(true);
  };

  const handleDeleteProfile = async (code_profile) =>
  {
    Alert.alert("Confirmation", "Voulez-vous supprimer ce profil ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () =>
        {
          try
          {
            const profileRef = ref(database, `profiles/${code_profile}`);
            await remove(profileRef);
            Alert.alert("Succès", "Profil supprimé.");
          } catch (error)
          {
            console.error("Erreur:", error);
            Alert.alert("Erreur", "Impossible de supprimer le profil.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{modificationMode ? "Modifier Profil" : "Ajouter Profil"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Profil"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        editable={!modificationMode}
      />
      <TextInput
        style={styles.input}
        placeholder="Libellé Profil"
        value={libelle}
        onChangeText={setLibelle}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleAddOrUpdateProfile}>
        <Text style={styles.btnText}>{modificationMode ? "Modifier Profil" : "Ajouter Profil"}</Text>
      </TouchableOpacity>

      {modificationMode && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.code_profile.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>🧩 Profil: {item.code_profile}</Text>
            <Text style={styles.cardText}>📛 Libellé: {item.libelle_profile}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEditProfile(item)}>
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteProfile(item.code_profile)}>
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

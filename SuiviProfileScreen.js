import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { ref, set, onValue, get, remove } from "firebase/database";
import { database } from "./firebaseconfig";

export default function SuiviProfileScreen() {
  const [suivis, setSuivis] = useState([]);
  const [matricule, setMatricule] = useState('');
  const [codeProfile, setCodeProfile] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [motpass, setMotpass] = useState('');
  const [modificationMode, setModificationMode] = useState(false);

  useEffect(() => {
    const suivisRef = ref(database, 'suivi_profiles');
    const unsubscribe = onValue(suivisRef, snapshot => {
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

  const validateInputs = () => {
    if (!matricule || !codeProfile || !dateDebut || !dateFin || !motpass) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return false;
    }

    const matNum = parseInt(matricule);
    const codeNum = parseInt(codeProfile);
    if (isNaN(matNum) || isNaN(codeNum)) {
      Alert.alert("Erreur", "Matricule et code profil doivent être des entiers.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setMatricule('');
    setCodeProfile('');
    setDateDebut('');
    setDateFin('');
    setMotpass('');
    setModificationMode(false);
  };

  const handleAddOrUpdateSuivi = async () => {
    if (!validateInputs()) return;

    const matNum = parseInt(matricule);
    const codeNum = parseInt(codeProfile);

    try {
      // Vérifier si user existe
      const userSnap = await get(ref(database, `users/${matNum}`));
      if (!userSnap.exists()) {
        Alert.alert("Erreur", `Aucun utilisateur avec le matricule ${matNum}`);
        return;
      }

      // Vérifier si profil existe
      const profileSnap = await get(ref(database, `profiles/${codeNum}`));
      if (!profileSnap.exists()) {
        Alert.alert("Erreur", `Aucun profil avec le code ${codeNum}`);
        return;
      }

      const id = `${matNum}_${codeNum}`;
      const suiviRef = ref(database, `suivi_profiles/${id}`);
      await set(suiviRef, {
        matricule: matNum,
        code_profile: codeNum,
        date_debut: dateDebut,
        date_fin: dateFin,
        motpass: motpass
      });

      Alert.alert("Succès", modificationMode ? "Affectation modifiée." : "Affectation ajoutée.");
      resetForm();

    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  const handleEditSuivi = (item) => {
    setMatricule(item.matricule.toString());
    setCodeProfile(item.code_profile.toString());
    setDateDebut(item.date_debut);
    setDateFin(item.date_fin);
    setMotpass(item.motpass);
    setModificationMode(true);
  };

  const handleDeleteSuivi = async (matricule, codeProfile) => {
    Alert.alert("Confirmation", "Voulez-vous supprimer cette affectation ?", [
      {
        text: "Annuler",
        style: "cancel"
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const id = `${matricule}_${codeProfile}`;
            const suiviRef = ref(database, `suivi_profiles/${id}`);
            await remove(suiviRef);
            Alert.alert("Succès", "Affectation supprimée.");
          } catch (error) {
            console.error("Erreur:", error);
            Alert.alert("Erreur", "Impossible de supprimer l'affectation.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{modificationMode ? "Modifier Affectation" : "Affectation Profil à Utilisateur"}</Text>

      <TextInput style={styles.input} placeholder="Matricule" value={matricule} onChangeText={setMatricule} keyboardType="numeric" editable={!modificationMode} />
      <TextInput style={styles.input} placeholder="Code Profil" value={codeProfile} onChangeText={setCodeProfile} keyboardType="numeric" editable={!modificationMode} />
      <TextInput style={styles.input} placeholder="Date Début" value={dateDebut} onChangeText={setDateDebut} />
      <TextInput style={styles.input} placeholder="Date Fin" value={dateFin} onChangeText={setDateFin} />
      <TextInput style={styles.input} placeholder="Mot de passe" value={motpass} onChangeText={setMotpass} secureTextEntry />

      <Button title={modificationMode ? "Modifier Affectation" : "Ajouter Affectation"} onPress={handleAddOrUpdateSuivi} />
      {modificationMode && <Button title="Annuler" color="grey" onPress={resetForm} />}

      <FlatList
        data={suivis}
        keyExtractor={(item) => `${item.matricule}_${item.code_profile}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>👤 Matricule: {item.matricule}</Text>
            <Text>🧩 Profil: {item.code_profile}</Text>
            <Text>📅 {item.date_debut} → {item.date_fin}</Text>
            <Text>🔐 Mot de passe: {item.motpass}</Text>
            <View style={styles.actions}>
              <Button title="✏️" onPress={() => handleEditSuivi(item)} />
              <View style={{ width: 10 }} />
              <Button title="🗑️" color="red" onPress={() => handleDeleteSuivi(item.matricule, item.code_profile)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  item: { padding: 12, backgroundColor: "#f5f5f5", borderRadius: 6, marginBottom: 10 },
  actions: { flexDirection: "row", marginTop: 10, justifyContent: "flex-end" }
});

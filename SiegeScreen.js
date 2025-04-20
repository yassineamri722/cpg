import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig"; // Assurez-vous de configurer Firebase correctement
import { ListItem, IconButton } from 'react-native-paper'; // Importation de Paper pour le design moderne

export default function SiegeScreen() {
  const [sieges, setSieges] = useState([]);
  const [siegeId, setSiegeId] = useState('');
  const [siegeNom, setSiegeNom] = useState('');
  const [disponibilite, setDisponibilite] = useState('');
  const [prix, setPrix] = useState('');
  const [editing, setEditing] = useState(null);


  
  useEffect(() => {
    // Récupérer les données depuis Firebase
    const dbRef = ref(database, 'sieges');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setSieges(list);
      } else {
        setSieges([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Enregistrer ou modifier un siège
  const handleSave = () => {
    if (!siegeId || !siegeNom || !disponibilite || !prix) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const siegeRef = ref(database, `sieges/${siegeId}`);
    set(siegeRef, {
      id: siegeId.trim(),
      nom: siegeNom.trim(),
      disponibilite: disponibilite.trim(),
      prix: prix.trim(),
    })
      .then(() => {
        Alert.alert("Succès", editing ? "Siège modifié." : "Siège ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  // Fonction pour éditer un siège
  const handleEdit = (item) => {
    setSiegeId(item.id);
    setSiegeNom(item.nom);
    setDisponibilite(item.disponibilite);
    setPrix(item.prix);
    setEditing(item.id);
  };

  // Fonction pour supprimer un siège
  const handleDelete = (id) => {
    Alert.alert("Confirmation", "Supprimer ce siège ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () => {
          const siegeRef = ref(database, `sieges/${id}`);
          remove(siegeRef)
            .then(() => Alert.alert("Siège supprimé"))
            .catch(err => console.error("Erreur suppression :", err));
        }
      }
    ]);
  };

  // Réinitialiser le formulaire après ajout ou modification
  const resetForm = () => {
    setSiegeId('');
    setSiegeNom('');
    setDisponibilite('');
    setPrix('');
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Sièges</Text>

      {/* Formulaire d'ajout/modification */}
      <TextInput
        style={styles.input}
        placeholder="ID du siège"
        value={siegeId}
        onChangeText={setSiegeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom du siège"
        value={siegeNom}
        onChangeText={setSiegeNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Disponibilité"
        value={disponibilite}
        onChangeText={setDisponibilite}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix"
        value={prix}
        onChangeText={setPrix}
      />

      <Button title={editing ? "Modifier" : "Ajouter"} onPress={handleSave} />
      {editing && <Button title="Annuler" color="gray" onPress={resetForm} />}

      {/* Liste des sièges */}
      <FlatList
        data={sieges}
        keyExtractor={item => item.id || Math.random().toString(36).substr(2, 9)}
        renderItem={({ item }) => (
          <ListItem
            title={`${item.nom} - ${item.disponibilite}`}
            description={`Prix: ${item.prix}`}
            left={props => <ListItem.Icon {...props} icon="seat" />}
            right={props => (
              <>
                <IconButton icon="pencil" onPress={() => handleEdit(item)} />
                <IconButton icon="delete" onPress={() => handleDelete(item.id)} color="red" />
              </>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  item: { padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginTop: 15 },
});

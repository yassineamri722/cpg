import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity } from "react-native";
import { ref, set, remove, onValue, get } from "firebase/database";
import { database } from "./firebaseconfig"; // Assurez-vous de configurer Firebase correctement
import { IconButton } from 'react-native-paper'; // Correct import for 'IconButton'
import styles from './globalStyles'; // Corrected import for global styles
import { Picker } from '@react-native-picker/picker';
export default function SiegeScreen()
{
  const [sieges, setSieges] = useState([]);
  const [siegeId, setSiegeId] = useState('');
  const [siegeNom, setSiegeNom] = useState('');
  const [disponibilite, setDisponibilite] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() =>
  {
    // Récupérer les données depuis Firebase
    const dbRef = ref(database, 'sieges');
    const unsubscribe = onValue(dbRef, snapshot =>
    {
      const data = snapshot.val();
      if (data)
      {
        const list = Object.values(data);
        setSieges(list);
      } else
      {
        setSieges([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Enregistrer ou modifier un siège
  const handleSave = () =>
  {
    if (!siegeId || !siegeNom || !disponibilite)
    {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const siegeRef = ref(database, `sieges/${siegeId}`);
    set(siegeRef, {
      id: siegeId.trim(),
      nom: siegeNom.trim(),
      disponibilite: disponibilite.trim(),
    })
      .then(() =>
      {
        Alert.alert("Succès", editing ? "Siège modifié." : "Siège ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  // Fonction pour éditer un siège
  const handleEdit = (item) =>
  {
    setSiegeId(item.id);
    setSiegeNom(item.nom);
    setDisponibilite(item.disponibilite);
    setEditing(item.id);
  };

  // Fonction pour supprimer un siège
  const handleDelete = async (id) =>
  {
    try
    {
      // Reference to "suivi_produits" in the database
      const suiviProduitsRef = ref(database, 'suivi_produits');

      // Query to check if there are any suivi_produits with the given siege id (codeSiege)
      const snapshot = await get(suiviProduitsRef);
      const data = snapshot.val();

      let siegeHasSuiviProduit = false;

      // Check if any suivi_produits has the current siege id
      if (data)
      {
        Object.entries(data).forEach(([key, value]) =>
        {
          if (value.codeSiege === id)
          {
            siegeHasSuiviProduit = true;
          }
        });
      }

      if (siegeHasSuiviProduit)
      {
        // If there are associated suivi_produits, alert the user and do not delete
        Alert.alert("Impossible de supprimer", "Il existe des suivis produits associés à ce siège.");
      } else
      {
        // If no associated suivi_produits, proceed with deletion
        Alert.alert("Confirmation", "Supprimer ce siège ?", [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer", style: "destructive",
            onPress: () =>
            {
              const siegeRef = ref(database, `sieges/${id}`);
              remove(siegeRef)
                .then(() => Alert.alert("Siège supprimé"))
                .catch(err => console.error("Erreur suppression :", err));
            }
          }
        ]);
      }
    } catch (err)
    {
      console.error("Erreur lors de la vérification des suivis produits:", err);
      Alert.alert("Erreur", "Impossible de vérifier les suivis produits associés.");
    }
  };

  // Réinitialiser le formulaire après ajout ou modification
  const resetForm = () =>
  {
    setSiegeId('');
    setSiegeNom('');
    setDisponibilite('');
    setEditing(null);
  };

  // Helper function to safely handle undefined values
  const getSafeValue = (value) => value || "Non défini"; // Default to "Non défini" if value is undefined or null

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

      {/* Custom "Ajouter" button */}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
        <Text style={styles.btnText}>{editing ? "Modifier" : "Ajouter"}</Text>
      </TouchableOpacity>

      {editing && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      {/* Liste des sièges */}
      <FlatList
        data={sieges}
        keyExtractor={item => item.id || Math.random().toString(36).substr(2, 9)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{`${getSafeValue(item.nom)} - ${getSafeValue(item.disponibilite)}`}</Text>
            <View style={styles.cardActions}>
              <IconButton icon="pencil" onPress={() => handleEdit(item)} />
              <IconButton icon="delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}

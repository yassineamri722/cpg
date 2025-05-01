import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { getDatabase, ref, get, push, update, remove } from "firebase/database";
import styles from "./globalStyles"; // Assurez-vous que ce fichier est correctement importé

const db = getDatabase();

export default function SuiviProduitScreen() {
  const [codeProduit, setCodeProduit] = useState("");
  const [codeSiege, setCodeSiege] = useState("");
  const [qteProduction, setQteProduction] = useState("");
  const [suiviProduits, setSuiviProduits] = useState([]);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    fetchSuiviProduits();
  }, []);

  const fetchSuiviProduits = async () => {
    try {
      const snapshot = await get(ref(db, "suivi_produits"));
      const data = snapshot.val();
      setSuiviProduits(
        data
          ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
          : []
      );
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };

  const controleCodes = async () => {
    try {
      const prodSnap = await get(ref(db, `produits/${codeProduit}`));
      const siegeSnap = await get(ref(db, `sieges/${codeSiege}`));

      if (!prodSnap.exists()) {
        Alert.alert("Erreur", "Produit introuvable");
        return false;
      }
      if (!siegeSnap.exists()) {
        Alert.alert("Erreur", "Siège introuvable");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erreur de validation des codes:", error);
      Alert.alert("Erreur", "Problème de validation des codes");
      return false;
    }
  };

  const handleEnregistrer = async () => {
    if (!codeProduit || !codeSiege || !qteProduction) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }
    if (!(await controleCodes())) return;

    const payload = {
      codeProduit,
      codeSiege,
      qteProduction: parseInt(qteProduction, 10),
      date: new Date().toISOString(),
    };

    try {
      if (editKey) {
        await update(ref(db, `suivi_produits/${editKey}`), {
          qteProduction: payload.qteProduction,
        });
        setEditKey(null);
      } else {
        await push(ref(db, "suivi_produits"), payload);
      }
      fetchSuiviProduits();
      resetForm();
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      Alert.alert("Erreur", "Impossible d'enregistrer le suivi");
    }
  };

  const handleSupprimer = (id) => {
    Alert.alert("Confirmation", "Voulez-vous supprimer ce suivi ?", [
      { text: "Annuler" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await remove(ref(db, `suivi_produits/${id}`));
            fetchSuiviProduits();
          } catch (error) {
            console.error("Erreur de suppression:", error);
            Alert.alert("Erreur", "Suppression échouée");
          }
        },
      },
    ]);
  };

  const chargerSuiviProduit = (item) => {
    setCodeProduit(item.codeProduit);
    setCodeSiege(item.codeSiege);
    setQteProduction(String(item.qteProduction));
    setEditKey(item.id);
  };

  const resetForm = () => {
    setCodeProduit("");
    setCodeSiege("");
    setQteProduction("");
    setEditKey(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi des Produits</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Produit"
        value={codeProduit}
        onChangeText={setCodeProduit}
      />
      <TextInput
        style={styles.input}
        placeholder="Code Siège"
        value={codeSiege}
        onChangeText={setCodeSiege}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité de production"
        value={qteProduction}
        keyboardType="numeric"
        onChangeText={setQteProduction}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleEnregistrer}>
        <Text style={styles.btnText}>
          {editKey ? "Modifier Suivi" : "Ajouter Suivi"}
        </Text>
      </TouchableOpacity>

      {editKey && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler modification</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={suiviProduits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Produit: {item.codeProduit} | Siège: {item.codeSiege}
            </Text>
            <Text style={styles.cardText}>
              Quantité: {item.qteProduction}
            </Text>
            <Text style={styles.cardText}>
              Date: {new Date(item.date).toLocaleString()}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => chargerSuiviProduit(item)}
              >
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleSupprimer(item.id)}
              >
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.subtitle}>Aucun suivi de produit enregistré</Text>
        }
      />
    </View>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { getDatabase, ref, get, push, update, remove } from "firebase/database";

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
      if (data) {
        const suiviList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setSuiviProduits(suiviList);
      } else {
        setSuiviProduits([]);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };

  // Fonction de validation pour vérifier la présence du produit et du siège
  const controleCodes = async () => {
    try {
      const produitSnapshot = await get(ref(db, `produits/${codeProduit}`));
      const siegeSnapshot = await get(ref(db, `sieges/${codeSiege}`));

      // Vérification de l'existence du produit
      if (!produitSnapshot.exists()) {
        Alert.alert("Erreur", "Produit introuvable");
        return false;
      }

      // Vérification de l'existence du siège
      if (!siegeSnapshot.exists()) {
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

    const isValid = await controleCodes(); // Vérifie les codes produit et siège
    if (!isValid) return;

    const suiviProduit = {
      codeProduit,
      codeSiege,
      qteProduction: parseInt(qteProduction),
      date: new Date().toISOString(),
    };

    try {
      if (editKey) {
        // Mise à jour si l'élément existe déjà
        await update(ref(db, `suivi_produits/${editKey}`), {
          qteProduction: suiviProduit.qteProduction,
        });
        setEditKey(null);
      } else {
        // Ajout d'un nouvel élément
        await push(ref(db, "suivi_produits"), suiviProduit);
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
        onPress: async () => {
          try {
            await remove(ref(db, `suivi_produits/${id}`));
            fetchSuiviProduits();
          } catch (error) {
            console.error("Erreur de suppression:", error);
            Alert.alert("Erreur", "Suppression échouée");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const chargerSuiviProduit = (suiviProduit) => {
    setCodeProduit(suiviProduit.codeProduit);
    setCodeSiege(suiviProduit.codeSiege);
    setQteProduction(String(suiviProduit.qteProduction));
    setEditKey(suiviProduit.id);
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
        onChangeText={setCodeProduit} // Permet de modifier le code produit
      />
      <TextInput
        style={styles.input}
        placeholder="Code Siège"
        value={codeSiege}
        onChangeText={setCodeSiege} // Permet de modifier le code siège
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité de production"
        value={qteProduction}
        keyboardType="numeric"
        onChangeText={setQteProduction}
      />

      <Button
        title={editKey ? "Modifier Suivi" : "Ajouter Suivi"}
        onPress={handleEnregistrer}
      />

      {editKey && (
        <View style={{ marginTop: 10 }}>
          <Button title="Annuler modification" color="orange" onPress={resetForm} />
        </View>
      )}

      <FlatList
        data={suiviProduits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.suiviItem}>
            <Text style={styles.suiviText}>
              Produit: {item.codeProduit} | Siège: {item.codeSiege}
            </Text>
            <Text style={styles.suiviText}>
              Quantité: {item.qteProduction}
            </Text>
            <Text style={styles.suiviText}>
              Date: {new Date(item.date).toLocaleString()}
            </Text>
            <View style={styles.buttons}>
              <Button title="Modifier" onPress={() => chargerSuiviProduit(item)} />
              <Button
                title="Supprimer"
                color="red"
                onPress={() => handleSupprimer(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun suivi de produit enregistré</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  suiviItem: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  suiviText: {
    fontSize: 15,
    marginBottom: 2,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

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

export default function SuiviVentesScreen() {
  const [codeClient, setCodeClient] = useState("");
  const [codeProduit, setCodeProduit] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");
  const [ventes, setVentes] = useState([]);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    fetchVentes();
  }, []);

  const fetchVentes = async () => {
    try {
      const snapshot = await get(ref(db, "ventes"));
      const data = snapshot.val();
      if (data) {
        const ventesList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setVentes(ventesList);
      } else {
        setVentes([]);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
    }
  };

  const controleCodes = async () => {
    try {
      const clientSnapshot = await get(ref(db, `clients/${codeClient}`));
      const produitSnapshot = await get(ref(db, `produitsvendus/${codeProduit}`)); // Table de produits vendus

      if (!clientSnapshot.exists()) {
        Alert.alert("Erreur", "Client introuvable");
        return false;
      }

      if (!produitSnapshot.exists()) {
        Alert.alert("Erreur", "Produit introuvable");
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
    if (!codeClient || !codeProduit || !quantite || !prix) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }

    const isValid = await controleCodes();
    if (!isValid) return;

    const vente = {
      codeClient,
      codeProduit,
      quantite: parseInt(quantite),
      prix: parseFloat(prix),
      date: new Date().toISOString(),
    };

    try {
      if (editKey) {
        // Mise à jour uniquement des champs quantite et prix
        await update(ref(db, `ventes/${editKey}`), {
          quantite: vente.quantite,
          prix: vente.prix,
        });
        setEditKey(null);
      } else {
        await push(ref(db, "ventes"), vente);
      }
      fetchVentes();
      resetForm();
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      Alert.alert("Erreur", "Impossible d'enregistrer la vente");
    }
  };

  const handleSupprimer = (id) => {
    Alert.alert("Confirmation", "Voulez-vous supprimer cette vente ?", [
      { text: "Annuler" },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            await remove(ref(db, `ventes/${id}`));
            fetchVentes();
          } catch (error) {
            console.error("Erreur de suppression:", error);
            Alert.alert("Erreur", "Suppression échouée");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const chargerVente = (vente) => {
    setCodeClient(vente.codeClient);
    setCodeProduit(vente.codeProduit);
    setQuantite(String(vente.quantite));
    setPrix(String(vente.prix));
    setEditKey(vente.id);
  };

  const resetForm = () => {
    setCodeClient("");
    setCodeProduit("");
    setQuantite("");
    setPrix("");
    setEditKey(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Ventes</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Client"
        value={codeClient}
        onChangeText={setCodeClient} // Permet de modifier le code client
      />
      <TextInput
        style={styles.input}
        placeholder="Code Produit"
        value={codeProduit}
        onChangeText={setCodeProduit} // Permet de modifier le code produit
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        value={quantite}
        keyboardType="numeric"
        onChangeText={setQuantite}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix"
        value={prix}
        keyboardType="numeric"
        onChangeText={setPrix}
      />

      <Button
        title={editKey ? "Modifier Vente" : "Ajouter Vente"}
        onPress={handleEnregistrer}
      />

      {editKey && (
        <View style={{ marginTop: 10 }}>
          <Button title="Annuler modification" color="orange" onPress={resetForm} />
        </View>
      )}

      <FlatList
        data={ventes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.venteItem}>
            <Text style={styles.venteText}>
              Client: {item.codeClient} | Produit: {item.codeProduit}
            </Text>
            <Text style={styles.venteText}>
              Quantité: {item.quantite} | Prix: {item.prix} DT
            </Text>
            <Text style={styles.venteText}>
              Date: {new Date(item.date).toLocaleString()}
            </Text>
            <View style={styles.buttons}>
              <Button title="Modifier" onPress={() => chargerVente(item)} />
              <Button
                title="Supprimer"
                color="red"
                onPress={() => handleSupprimer(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune vente enregistrée</Text>
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
  venteItem: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  venteText: {
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

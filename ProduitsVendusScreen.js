import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { getDatabase, ref, get, set, remove } from "firebase/database";

const database = getDatabase();

function ProduitsVendusScreen() {
  const [codeProduit, setCodeProduit] = useState("");
  const [libelleProduit, setLibelleProduit] = useState("");
  const [produits, setProduits] = useState([]);
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() => {
    const produitsVendusRef = ref(database, 'produitsvendus'); // Changed here
    get(produitsVendusRef).then(snapshot => {
      const data = snapshot.val();
      if (data) {
        setProduits(Object.values(data));
      }
    }).catch(error => {
      console.error("Erreur de récupération des produits:", error);
    });
  }, []);

  const resetForm = () => {
    setCodeProduit("");
    setLibelleProduit("");
    setEditingCode(null);
  };

  const ajouterOuModifierProduit = () => {
    if (!codeProduit || !libelleProduit) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const produitVendusRef = ref(database, `produitsvendus/${codeProduit}`); // Changed here

    if (editingCode) {
      // Modification
      set(produitVendusRef, {
        code: codeProduit,
        libelle: libelleProduit,
      }).then(() => {
        updateListeProduits();
        resetForm();
      });
    } else {
      // Vérifier si le code existe déjà
      const exists = produits.find((p) => p.code === codeProduit);
      if (exists) {
        Alert.alert("Erreur", "Code produit déjà existant");
        return;
      }

      // Ajout
      set(produitVendusRef, {
        code: codeProduit,
        libelle: libelleProduit,
      }).then(() => {
        updateListeProduits();
        resetForm();
      });
    }
  };

  const supprimerProduit = (code) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer ce produit ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const produitVendusRef = ref(database, `produitsvendus/${code}`); // Changed here
            remove(produitVendusRef).then(() => {
              updateListeProduits();
              if (editingCode === code) resetForm();
            });
          },
        },
      ]
    );
  };

  const commencerEdition = (produit) => {
    setCodeProduit(produit.code);
    setLibelleProduit(produit.libelle);
    setEditingCode(produit.code);
  };

  const updateListeProduits = () => {
    const produitsVendusRef = ref(database, 'produitsvendus'); // Changed here
    get(produitsVendusRef).then(snapshot => {
      const data = snapshot.val();
      if (data) {
        setProduits(Object.values(data));
      } else {
        setProduits([]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Produits Vendus</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Produit"
        keyboardType="numeric"
        value={codeProduit}
        onChangeText={setCodeProduit}
      />
      <TextInput
        style={styles.input}
        placeholder="Libellé Produit"
        value={libelleProduit}
        onChangeText={setLibelleProduit}
      />

      <Button
        title={editingCode ? "Mettre à jour le produit" : "Ajouter Produit"}
        onPress={ajouterOuModifierProduit}
      />

      {editingCode && (
        <View style={{ marginTop: 10 }}>
          <Button title="Annuler la modification" onPress={resetForm} color="gray" />
        </View>
      )}

      <FlatList
        data={produits}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.produitItem}>
            <Text style={styles.produitText}>
              {item.code} - {item.libelle}
            </Text>
            <View style={styles.buttonRow}>
              <Button title="Modifier" onPress={() => commencerEdition(item)} />
              <View style={{ width: 10 }} />
              <Button
                title="Supprimer"
                onPress={() => supprimerProduit(item.code)}
                color="red"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun produit ajouté</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  produitItem: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  produitText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});

export default ProduitsVendusScreen;

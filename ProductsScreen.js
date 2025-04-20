import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { ref, set, remove, onValue } from "firebase/database";
import { database } from "./firebaseconfig";

export default function ProductsScreen() {
  const [produits, setProduits] = useState([]);
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, 'produits');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setProduits(list);
      } else {
        setProduits([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    if (!code || !libelle) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const codeNum = parseInt(code);
    if (isNaN(codeNum)) {
      Alert.alert("Code invalide", "Le code doit être un entier.");
      return;
    }

    const produitRef = ref(database, `produits/${codeNum}`);
    set(produitRef, {
      code_produit: codeNum,
      libelle_produit: libelle.trim()
    })
      .then(() => {
        Alert.alert("Succès", editing ? "Produit modifié." : "Produit ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  const handleEdit = (produit) => {
    setCode(produit.code_produit.toString());
    setLibelle(produit.libelle_produit);
    setEditing(produit.code_produit);
  };

  const handleDelete = (code_produit) => {
    Alert.alert("Confirmation", "Supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer", style: "destructive",
        onPress: () => {
          const produitRef = ref(database, `produits/${code_produit}`);
          remove(produitRef)
            .then(() => Alert.alert("Produit supprimé"))
            .catch(err => console.error("Erreur suppression :", err));
        }
      }
    ]);
  };

  const resetForm = () => {
    setCode('');
    setLibelle('');
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Produits</Text>

      <TextInput
        style={styles.input}
        placeholder="Code du produit"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Libellé du produit"
        value={libelle}
        onChangeText={setLibelle}
      />

      <Button title={editing ? "Modifier le produit" : "Ajouter le produit"} onPress={handleSave} />
      {editing && <Button title="Annuler" color="gray" onPress={resetForm} />}

      <FlatList
        data={produits}
        keyExtractor={item => item.code_produit.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.code_produit} - {item.libelle_produit}
            </Text>
            <View style={styles.buttonGroup}>
              <Button title="Modifier" onPress={() => handleEdit(item)} />
              <Button title="Supprimer" color="red" onPress={() => handleDelete(item.code_produit)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  item: { padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginTop: 15 },
  itemText: { fontSize: 16, marginBottom: 10 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between" },
});

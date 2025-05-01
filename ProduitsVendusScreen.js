import React, { useState, useEffect } from "react";
import
{
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import styles from "./globalStyles"; // Remplace par le bon chemin

const database = getDatabase();

function ProduitsVendusScreen()
{
  const [codeProduit, setCodeProduit] = useState("");
  const [libelleProduit, setLibelleProduit] = useState("");
  const [produits, setProduits] = useState([]);
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() =>
  {
    updateListeProduits();
  }, []);

  const resetForm = () =>
  {
    setCodeProduit("");
    setLibelleProduit("");
    setEditingCode(null);
  };

  const ajouterOuModifierProduit = () =>
  {
    if (!codeProduit || !libelleProduit)
    {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const produitRef = ref(database, `produitsvendus/${codeProduit}`);

    if (editingCode)
    {
      // Modification
      set(produitRef, {
        code: codeProduit,
        libelle: libelleProduit,
      }).then(() =>
      {
        updateListeProduits();
        resetForm();
      });
    } else
    {
      // Vérifier si le code existe déjà
      const exists = produits.find((p) => p.code === codeProduit);
      if (exists)
      {
        Alert.alert("Erreur", "Code produit déjà existant");
        return;
      }

      // Ajout
      set(produitRef, {
        code: codeProduit,
        libelle: libelleProduit,
      }).then(() =>
      {
        updateListeProduits();
        resetForm();
      });
    }
  };

  const supprimerProduit = (code) =>
  {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () =>
        {
          const produitRef = ref(database, `produitsvendus/${code}`);
          remove(produitRef).then(() =>
          {
            updateListeProduits();
            if (editingCode === code) resetForm();
          });
        },
      },
    ]);
  };

  const commencerEdition = (produit) =>
  {
    setCodeProduit(produit.code);
    setLibelleProduit(produit.libelle);
    setEditingCode(produit.code);
  };

  const updateListeProduits = () =>
  {
    const produitsRef = ref(database, "produitsvendus");
    get(produitsRef)
      .then((snapshot) =>
      {
        const data = snapshot.val();
        if (data)
        {
          setProduits(Object.values(data));
        } else
        {
          setProduits([]);
        }
      })
      .catch((error) =>
      {
        console.error("Erreur de récupération des produits:", error);
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

      <TouchableOpacity style={styles.primaryBtn} onPress={ajouterOuModifierProduit}>
        <Text style={styles.btnText}>
          {editingCode ? "Mettre à jour le produit" : "Ajouter Produit"}
        </Text>
      </TouchableOpacity>

      {editingCode && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler la modification</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={produits}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.code} - {item.libelle}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => commencerEdition(item)}
              >
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => supprimerProduit(item.code)}
              >
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText || { textAlign: "center", marginTop: 20, fontStyle: "italic", color: "#6B7280" }}>
            Aucun produit ajouté
          </Text>
        }
      />
    </View>
  );
}

export default ProduitsVendusScreen;

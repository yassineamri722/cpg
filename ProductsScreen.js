import React, { useState, useEffect } from "react";
import
  {
    View,
    Text,
    TextInput,
    FlatList,
    Alert,
    TouchableOpacity
  } from "react-native";
import { ref, set, remove, onValue, get } from "firebase/database";
import { database } from "./firebaseconfig";
import styles from './globalStyles';
import { Picker } from "@react-native-picker/picker";

export default function ProductsScreen()
{
  const [produits, setProduits] = useState([]);
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [type, setType] = useState('Brut');
  const [editing, setEditing] = useState(null);

  useEffect(() =>
  {
    const dbRef = ref(database, 'produits');
    const unsubscribe = onValue(dbRef, snapshot =>
    {
      const data = snapshot.val();
      setProduits(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = () =>
  {
    if (!code || !libelle || !type)
    {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    const codeNum = parseInt(code);
    if (isNaN(codeNum))
    {
      Alert.alert("Code invalide", "Le code doit être un entier.");
      return;
    }

    const produitRef = ref(database, `produits/${codeNum}`);
    set(produitRef, {
      code_produit: codeNum,
      libelle_produit: libelle.trim(),
      type_produit: type
    })
      .then(() =>
      {
        Alert.alert("Succès", editing ? "Produit modifié." : "Produit ajouté.");
        resetForm();
      })
      .catch(err => console.error("Erreur :", err));
  };

  const handleEdit = (produit) =>
  {
    setCode(produit.code_produit.toString());
    setLibelle(produit.libelle_produit);
    setType(produit.type_produit || 'Brut');
    setEditing(produit.code_produit);
  };

  const handleDelete = async (code_produit) =>
  {
    try
    {
      const snapshot = await get(ref(database, 'suivi_produits'));
      const data = snapshot.val();

      const produitUtilisé = Object.values(data || {}).some(
        suivi => suivi.codeProduit === code_produit.toString()
      );

      if (produitUtilisé)
      {
        Alert.alert("Impossible de supprimer", "Ce produit est utilisé dans des suivis.");
      } else
      {
        Alert.alert("Confirmation", "Supprimer ce produit ?", [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer", style: "destructive",
            onPress: () =>
            {
              const produitRef = ref(database, `produits/${code_produit}`);
              remove(produitRef)
                .then(() => Alert.alert("Produit supprimé"))
                .catch(err => console.error("Erreur suppression :", err));
            }
          }
        ]);
      }
    } catch (err)
    {
      console.error("Erreur lors de la vérification des suivis:", err);
      Alert.alert("Erreur", "Vérification des suivis échouée.");
    }
  };

  const resetForm = () =>
  {
    setCode('');
    setLibelle('');
    setType('Brut');
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

      <Picker
        selectedValue={type}
        style={[styles.input, { height: 50 }]}
        onValueChange={setType}
      >
        <Picker.Item label="Brut" value="Brut" />
        <Picker.Item label="Séché" value="Séché" />
        <Picker.Item label="Filtré" value="Filtré" />
      </Picker>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSave}>
        <Text style={styles.btnText}>{editing ? "Modifier" : "Ajouter"}</Text>
      </TouchableOpacity>

      {editing && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={produits}
        keyExtractor={item => item.code_produit.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.code_produit} - {item.libelle_produit} ({item.type_produit})
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.code_produit)}>
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );



  
}
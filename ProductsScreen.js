import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { addProduit, getProduits, updateProduit, deleteProduit } from './firebaseServices';  // Importer vos fonctions Firebase

const ProductsScreen = ({ navigation }) => {  // Recevez la prop 'navigation' ici
  const [produits, setProduits] = useState([]);  // Liste des produits
  const [codeProduit, setCodeProduit] = useState('');  // Code du produit pour mise à jour ou suppression
  const [libelleProduit, setLibelleProduit] = useState('');  // Libellé du produit

  // Récupérer les produits lors du montage du composant
  useEffect(() => {
    const fetchProduits = async () => {
      const produitsList = await getProduits();
      setProduits(produitsList);
    };
    fetchProduits();
  }, []);

  // Fonction pour ajouter un produit
  const handleAddProduit = async () => {
    if (codeProduit && libelleProduit) {
      await addProduit(codeProduit, libelleProduit);
      setProduits((prevState) => [
        ...prevState,
        { code_produit: codeProduit, libelle_produit: libelleProduit },
      ]);
      setCodeProduit('');
      setLibelleProduit('');
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
  };

  // Fonction pour mettre à jour un produit
  const handleUpdateProduit = async () => {
    if (codeProduit && libelleProduit) {
      await updateProduit(codeProduit, { libelle_produit: libelleProduit });
      setProduits((prevState) =>
        prevState.map((produit) =>
          produit.code_produit === codeProduit
            ? { ...produit, libelle_produit: libelleProduit }
            : produit
        )
      );
      setCodeProduit('');
      setLibelleProduit('');
    } else {
      Alert.alert('Erreur', 'Veuillez spécifier le produit à mettre à jour');
    }
  };

  // Fonction pour supprimer un produit
  const handleDeleteProduit = async (codeProduit) => {
    await deleteProduit(codeProduit);
    setProduits((prevState) =>
      prevState.filter((produit) => produit.code_produit !== codeProduit)
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Liste des Produits</Text>

      {/* Liste des produits */}
      <FlatList
        data={produits}
        keyExtractor={(item) => item.code_produit}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <Text style={{ flex: 1 }}>
              {item.code_produit} - {item.libelle_produit}
            </Text>
            <Button
              title="Supprimer"
              onPress={() => handleDeleteProduit(item.code_produit)}
            />
            <Button
              title="Mettre à jour"
              onPress={() => {
                setCodeProduit(item.code_produit);
                setLibelleProduit(item.libelle_produit);
              }}
            />
          </View>
        )}
      />

      {/* Formulaire pour ajouter un produit */}
      <TextInput
        value={codeProduit}
        onChangeText={setCodeProduit}
        placeholder="Code produit"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        value={libelleProduit}
        onChangeText={setLibelleProduit}
        placeholder="Libellé produit"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      <Button title="Ajouter Produit" onPress={handleAddProduit} />
      {codeProduit ? (
        <Button title="Mettre à jour Produit" onPress={handleUpdateProduit} />
      ) : null}

      {/* Naviguer vers SiegeScreen */}
      <Button
        title="Voir les Sièges"
        onPress={() => navigation.navigate('Siege')} // Navigation vers SiegeScreen
      />
    </View>
  );
};

export default ProductsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getProduits, addProduit, updateProduit, deleteProduit } from './firebaseServices'; // Assuming your functions are in a firebaseService file

const ProductScreen = ({ navigation }) => {  // Destructure `navigation` from props
  const [produits, setProduits] = useState([]);
  const [nom, setNom] = useState('');
  const [siegeID, setSiegeID] = useState('');
  const [type, setType] = useState('');
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    const fetchProduits = async () => {
      const produitsList = await getProduits();
      setProduits(produitsList);
    };

    fetchProduits();
  }, []);

  const handleAddProduit = async () => {
    if (nom && siegeID && type) {
      const newProduitID = await addProduit(nom, siegeID, type);
      setProduits((prevProduits) => [
        ...prevProduits,
        { id: newProduitID, nom, siegeID, type },
      ]);
      setNom('');
      setSiegeID('');
      setType('');
    } else {
      Alert.alert("Erreur", "Tous les champs doivent être remplis");
    }
  };

  const handleUpdateProduit = async () => {
    if (editID && nom && siegeID && type) {
      await updateProduit(editID, { nom, siegeID, type });
      setProduits((prevProduits) =>
        prevProduits.map((produit) =>
          produit.id === editID
            ? { ...produit, nom, siegeID, type }
            : produit
        )
      );
      setNom('');
      setSiegeID('');
      setType('');
      setEditID(null);
    } else {
      Alert.alert("Erreur", "Tous les champs doivent être remplis");
    }
  };

  const handleDeleteProduit = async (id) => {
    Alert.alert('Confirmation', 'Voulez-vous vraiment supprimer ce produit ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Supprimer',
        onPress: async () => {
          await deleteProduit(id);
          setProduits((prevProduits) => prevProduits.filter((produit) => produit.id !== id));
        },
      },
    ]);
  };

  const handleEditProduit = (produit) => {
    setNom(produit.nom);
    setSiegeID(produit.siegeID);
    setType(produit.type);
    setEditID(produit.id);
  };

  // Navigate to SiegeScreen when a product is clicked
  const handleViewSiege = (siegeID) => {
    navigation.navigate('Siège', { siegeID }); // Passing siegeID as a parameter
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nom du produit"
        value={nom}
        onChangeText={setNom}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="ID du siège"
        value={siegeID}
        onChangeText={setSiegeID}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Type"
        value={type}
        onChangeText={setType}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button
        title={editID ? 'Mettre à jour le produit' : 'Ajouter le produit'}
        onPress={editID ? handleUpdateProduit : handleAddProduit}
      />
      
      <FlatList
        data={produits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text>{item.nom}</Text>
              <Text>{item.siegeID}</Text>
              <Text>{item.type}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleEditProduit(item)} style={{ marginRight: 10 }}>
                <Text style={{ color: 'blue' }}>Éditer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProduit(item.id)}>
                <Text style={{ color: 'red' }}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleViewSiege(item.siegeID)}>
                <Text style={{ color: 'green' }}>Voir Siège</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ProductScreen;

// SiegeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { addSiege, getSieges, updateSiege, deleteSiege,checkSuiviProduitBySiege } from './firebaseServices';

const SiegeScreen = ({ navigation }) => {
  const [sieges, setSieges] = useState([]);  // Liste des sièges
  const [idSiege, setIdSiege] = useState('');  // ID du siège pour mise à jour ou suppression
  const [libelleSiege, setLibelleSiege] = useState('');  // Libellé du siège
  const [tel, setTel] = useState('');  // Téléphone du siège
  const [adresse, setAdresse] = useState('');  // Adresse du siège

  // Récupérer les sièges lors du montage du composant
  useEffect(() => {
    const fetchSieges = async () => {
      const siegesList = await getSieges();
      setSieges(siegesList);
    };
    fetchSieges();
  }, []);

  // Fonction pour ajouter un siège
  const handleAddSiege = async () => {
    if (idSiege && libelleSiege && tel && adresse) {
      await addSiege(idSiege, libelleSiege, tel, adresse);
      setSieges((prevState) => [
        ...prevState,
        { id_siege: idSiege, libelle_siege: libelleSiege, tel, adresse },
      ]);
      setIdSiege('');
      setLibelleSiege('');
      setTel('');
      setAdresse('');
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
  };

  // Fonction pour mettre à jour un siège
  const handleUpdateSiege = async () => {
    if (idSiege && libelleSiege && tel && adresse) {
      await updateSiege(idSiege, { libelle_siege: libelleSiege, tel, adresse });
      setSieges((prevState) =>
        prevState.map((siege) =>
          siege.id_siege === idSiege
            ? { ...siege, libelle_siege: libelleSiege, tel, adresse }
            : siege
        )
      );
      setIdSiege('');
      setLibelleSiege('');
      setTel('');
      setAdresse('');
    } else {
      Alert.alert('Erreur', 'Veuillez spécifier le siège à mettre à jour');
    }
  };

  // Fonction pour supprimer un siège
  const handleDeleteSiege = async (idSiege) => {
    try {
      // Vérification si ce siège est utilisé dans un suivi produit
      const isUsedInSuivi = await checkSuiviProduitBySiege(idSiege);
  
      if (isUsedInSuivi) {
        Alert.alert(
          "Impossible de supprimer",
          "Ce siège est utilisé dans un suivi produit. Veuillez d'abord supprimer les suivis produits associés."
        );
        return; // Empêche la suppression du siège
      }
  
      // Si le siège n'est pas utilisé dans un suivi produit, on peut procéder à la suppression
      await deleteSiege(idSiege);
      setSieges((prevState) =>
        prevState.filter((siege) => siege.id_siege !== idSiege) // Met à jour la liste des sièges après suppression
      );
      Alert.alert("Succès", "Siège supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du siège : ", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la suppression du siège.");
    }
  };
  

  return (
    <View style={{ padding: 20 }}>
      <Text>Liste des Sièges</Text>

      {/* Liste des sièges */}
      <FlatList
        data={sieges}
        keyExtractor={(item) => item.id_siege}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <Text style={{ flex: 1 }}>
              {item.id_siege} - {item.libelle_siege}
            </Text>
            <Button
              title="Supprimer"
              onPress={() => handleDeleteSiege(item.id_siege)}
            />
            <Button
              title="Mettre à jour"
              onPress={() => {
                setIdSiege(item.id_siege);
                setLibelleSiege(item.libelle_siege);
                setTel(item.tel);
                setAdresse(item.adresse);
              }}
            />
          </View>
        )}
      />

      {/* Formulaire pour ajouter un siège */}
      <TextInput
        value={idSiege}
        onChangeText={setIdSiege}
        placeholder="ID du siège"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        value={libelleSiege}
        onChangeText={setLibelleSiege}
        placeholder="Libellé du siège"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        value={tel}
        onChangeText={setTel}
        placeholder="Numéro de téléphone"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />
      <TextInput
        value={adresse}
        onChangeText={setAdresse}
        placeholder="Adresse"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      <Button title="Ajouter Siège" onPress={handleAddSiege} />
      {idSiege ? (
        <Button title="Mettre à jour Siège" onPress={handleUpdateSiege} />
      ) : null}

      {/* Naviguer vers SuiviProduitScreen */}
      <Button
        title="Suivi Produit"
        onPress={() => navigation.navigate('SuiviProductScreen')} // Navigation vers SuiviProduitScreen
      />

      {/* Naviguer vers ProductsScreen */}
      <Button
        title="Retour vers Produits"
        onPress={() => navigation.goBack()}  // Retour à ProductsScreen
      />
    </View>
  );
};

export default SiegeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { 
  getProduits, 
  getSieges, 
  addSuiviProduit, 
  updateSuiviProduit, 
  deleteSuiviProduit 
} from './firebaseServices';

const SuiviProduitScreen = ({ route, navigation }) => {
  const [codeProduit, setCodeProduit] = useState('');
  const [idSiege, setIdSiege] = useState('');
  const [quantite, setQuantite] = useState('');
  const [user, setUser] = useState('');

  const [produits, setProduits] = useState([]);
  const [sieges, setSieges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const produitsList = await getProduits();
      const siegesList = await getSieges();
      setProduits(produitsList);
      setSieges(siegesList);
    };
    fetchData();

    // Pré-remplissage en cas d'édition
    if (route.params?.isEdit) {
      const { suivi } = route.params;
      setCodeProduit(suivi.code_produit);
      setIdSiege(suivi.id_siege);
      setQuantite(suivi.quantite?.toString() || '');
      setUser(suivi.user_saisie || '');
    }
  }, []);

  const handleSave = async () => {
    if (!codeProduit || !idSiege || !quantite || !user) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }

    const produitExistant = produits.some(p => p.code_produit === codeProduit);
    const siegeExistant = sieges.some(s => s.id_siege === idSiege);

    if (!produitExistant) {
      Alert.alert('Erreur', 'Produit inexistant');
      return;
    }

    if (!siegeExistant) {
      Alert.alert('Erreur', 'Siège inexistant');
      return;
    }

    const data = {
      code_produit: codeProduit,
      id_siege: idSiege,
      quantite: parseInt(quantite),
      user_saisie: user,
    };

    try {
      if (route.params?.isEdit) {
        await updateSuiviProduit(codeProduit, idSiege, data);
        Alert.alert("Succès", "Suivi produit mis à jour !");
      } else {
        await addSuiviProduit(codeProduit, idSiege, data);
        Alert.alert("Succès", "Suivi produit ajouté !");
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmer",
      "Voulez-vous vraiment supprimer ce suivi produit ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSuiviProduit(codeProduit, idSiege);
              Alert.alert("Supprimé", "Suivi supprimé !");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Erreur", err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>
        {route.params?.isEdit ? 'Modifier Suivi Produit' : 'Ajouter Suivi Produit'}
      </Text>

      <TextInput
        value={codeProduit}
        onChangeText={setCodeProduit}
        placeholder="Code Produit"
        style={styles.input}
      />

      <TextInput
        value={idSiege}
        onChangeText={setIdSiege}
        placeholder="ID Siège"
        style={styles.input}
      />

      <TextInput
        value={quantite}
        onChangeText={setQuantite}
        placeholder="Quantité"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        value={user}
        onChangeText={setUser}
        placeholder="Utilisateur"
        style={styles.input}
      />

      <Button
        title={route.params?.isEdit ? 'Mettre à jour' : 'Ajouter'}
        onPress={handleSave}
      />

      {route.params?.isEdit && (
        <View style={{ marginTop: 10 }}>
          <Button
            title="Supprimer"
            onPress={handleDelete}
            color="red"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
};

export default SuiviProduitScreen;

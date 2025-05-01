import React, { useEffect, useState } from "react";
import
  {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Button,
  } from "react-native";
import
  {
    getFournisseurs,
    addFournisseur,
    updateFournisseur,
    deleteFournisseur,
  } from "./firebase_achat";
import
  {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
  } from "firebase/firestore";
import globalStyles from "./globalStyles";

const firestore = getFirestore();

const getSuiviAchatByFournisseur = async (code_fr) =>
{
  const q = query(
    collection(firestore, "suivi_achat"),
    where("code_fr", "==", code_fr)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

const FournisseurScreen = ({ navigation }) =>
{
  const [fournisseurs, setFournisseurs] = useState([]);
  const [code_fr, setCodeFr] = useState("");
  const [lib_fr, setLibFr] = useState("");
  const [tel_fr, setTelFr] = useState("");
  const [adress_fr, setAdressFr] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() =>
  {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () =>
  {
    setLoading(true);
    const data = await getFournisseurs();
    setFournisseurs(data);
    setLoading(false);
  };

  const handleAddOrUpdate = async () =>
  {
    if (!code_fr || !lib_fr || !tel_fr || !adress_fr)
    {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try
    {
      if (selectedCode)
      {
        await updateFournisseur(code_fr, lib_fr, tel_fr, adress_fr);
      } else
      {
        const existingFournisseur = fournisseurs.find(
          (f) => f.code_fr === code_fr
        );
        if (existingFournisseur)
        {
          Alert.alert("Erreur", "Le fournisseur avec ce code existe déjà.");
          return;
        }
        await addFournisseur(code_fr, lib_fr, tel_fr, adress_fr);
      }

      setCodeFr("");
      setLibFr("");
      setTelFr("");
      setAdressFr("");
      setSelectedCode(null);
      fetchFournisseurs();
    } catch (error)
    {
      Alert.alert("Erreur", "Une erreur est survenue. " + error.message);
    }
  };

  const handleDelete = async (code) =>
  {
    try
    {
      const suivis = await getSuiviAchatByFournisseur(code);
      if (suivis && suivis.length > 0)
      {
        Alert.alert("Erreur", "Ce fournisseur est utilisé dans un suivi d'achat.");
      } else
      {
        await deleteFournisseur(code);
        fetchFournisseurs();
        Alert.alert("Succès", "Fournisseur supprimé.");
      }
    } catch (error)
    {
      Alert.alert("Erreur", "Problème lors de la suppression.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Gestion des Fournisseurs</Text>

      <TextInput
        placeholder="Code Fournisseur"
        value={code_fr}
        onChangeText={setCodeFr}
        style={globalStyles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Libellé"
        value={lib_fr}
        onChangeText={setLibFr}
        style={globalStyles.input}
      />
      <TextInput
        placeholder="Téléphone"
        value={tel_fr}
        onChangeText={setTelFr}
        style={globalStyles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Adresse"
        value={adress_fr}
        onChangeText={setAdressFr}
        style={globalStyles.input}
      />

      <TouchableOpacity
        onPress={handleAddOrUpdate}
        style={globalStyles.primaryBtn}
      >
        <Text style={globalStyles.btnText}>
          {selectedCode ? "Modifier" : "Ajouter"}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={fournisseurs}
          keyExtractor={(item) => item.code_fr.toString()}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardText}>
                {item.code_fr} - {item.lib_fr} - {item.tel_fr}
              </Text>
              <View style={globalStyles.cardActions}>
                <TouchableOpacity
                  style={globalStyles.editBtn}
                  onPress={() =>
                  {
                    setCodeFr(item.code_fr);
                    setLibFr(item.lib_fr);
                    setTelFr(item.tel_fr);
                    setAdressFr(item.adress_fr);
                    setSelectedCode(item.code_fr);
                  }}
                >
                  <Text style={globalStyles.btnText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.deleteBtn}
                  onPress={() => handleDelete(item.code_fr)}
                >
                  <Text style={globalStyles.btnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FournisseurScreen;

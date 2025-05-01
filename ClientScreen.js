import React, { useState, useEffect } from "react";
import
  {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
  } from "react-native";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import styles from "./globalStyles"; // ← Adjust the path

const database = getDatabase();

function ClientScreen()
{
  const [codeClient, setCodeClient] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [telClient, setTelClient] = useState("");
  const [adresseClient, setAdresseClient] = useState("");
  const [clients, setClients] = useState([]);
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() =>
  {
    fetchClients();
  }, []);

  const fetchClients = () =>
  {
    const clientsRef = ref(database, "clients");
    get(clientsRef)
      .then((snapshot) =>
      {
        const data = snapshot.val();
        if (data)
        {
          setClients(Object.values(data));
        } else
        {
          setClients([]);
        }
      })
      .catch((error) =>
      {
        console.error("Erreur récupération clients :", error);
      });
  };

  const resetForm = () =>
  {
    setCodeClient("");
    setNomClient("");
    setTelClient("");
    setAdresseClient("");
    setEditingCode(null);
  };

  const ajouterOuModifierClient = () =>
  {
    if (!codeClient || !nomClient || !telClient || !adresseClient)
    {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const clientData = {
      code: codeClient,
      nom: nomClient,
      tel: telClient,
      adresse: adresseClient,
    };

    const clientRef = ref(database, `clients/${codeClient}`);

    set(clientRef, clientData)
      .then(() =>
      {
        fetchClients();
        resetForm();
      })
      .catch((error) =>
      {
        console.error("Erreur lors de l'enregistrement :", error);
      });
  };

  const supprimerClient = (code) =>
  {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce client ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
          {
            const clientRef = ref(database, `clients/${code}`);
            remove(clientRef)
              .then(() =>
              {
                fetchClients();
                if (editingCode === code) resetForm();
              })
              .catch((error) =>
                console.error("Erreur suppression client :", error)
              );
          },
        },
      ]
    );
  };

  const commencerEdition = (client) =>
  {
    setCodeClient(client.code);
    setNomClient(client.nom);
    setTelClient(client.tel);
    setAdresseClient(client.adresse);
    setEditingCode(client.code);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Clients</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Client"
        keyboardType="numeric"
        value={codeClient}
        onChangeText={setCodeClient}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom Client"
        value={nomClient}
        onChangeText={setNomClient}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="numeric"
        value={telClient}
        onChangeText={setTelClient}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse"
        value={adresseClient}
        onChangeText={setAdresseClient}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={ajouterOuModifierClient}
      >
        <Text style={styles.btnText}>
          {editingCode ? "Mettre à jour le client" : "Ajouter Client"}
        </Text>
      </TouchableOpacity>

      {editingCode && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Annuler la modification</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={clients}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.code} - {item.nom} - {item.tel}
            </Text>
            <Text style={styles.cardText}>Adresse : {item.adresse}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => commencerEdition(item)}
              >
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => supprimerClient(item.code)}
              >
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.cardText, { marginTop: 20 }]}>
            Aucun client ajouté
          </Text>
        }
      />
    </View>
  );
}

export default ClientScreen;

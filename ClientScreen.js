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

function ClientScreen() {
  const [codeClient, setCodeClient] = useState("");
  const [nomClient, setNomClient] = useState("");
  const [telClient, setTelClient] = useState("");
  const [adresseClient, setAdresseClient] = useState("");
  const [clients, setClients] = useState([]);
  const [editingCode, setEditingCode] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    const clientsRef = ref(database, "clients");
    get(clientsRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          setClients(Object.values(data));
        } else {
          setClients([]);
        }
      })
      .catch((error) => {
        console.error("Erreur récupération clients :", error);
      });
  };

  const resetForm = () => {
    setCodeClient("");
    setNomClient("");
    setTelClient("");
    setAdresseClient("");
    setEditingCode(null);
  };

  const ajouterOuModifierClient = () => {
    if (!codeClient || !nomClient || !telClient || !adresseClient) {
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
      .then(() => {
        fetchClients();
        resetForm();
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement :", error);
      });
  };

  const supprimerClient = (code) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce client ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const clientRef = ref(database, `clients/${code}`);
            remove(clientRef)
              .then(() => {
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

  const commencerEdition = (client) => {
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

      <Button
        title={editingCode ? "Mettre à jour le client" : "Ajouter Client"}
        onPress={ajouterOuModifierClient}
      />

      {editingCode && (
        <View style={{ marginTop: 10 }}>
          <Button title="Annuler la modification" onPress={resetForm} color="gray" />
        </View>
      )}

      <FlatList
        data={clients}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.clientItem}>
            <Text style={styles.clientText}>
              {item.code} - {item.nom} - {item.tel}
            </Text>
            <Text style={styles.clientText}>Adresse : {item.adresse}</Text>
            <View style={styles.buttonRow}>
              <Button title="Modifier" onPress={() => commencerEdition(item)} />
              <View style={{ width: 10 }} />
              <Button
                title="Supprimer"
                onPress={() => supprimerClient(item.code)}
                color="red"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun client ajouté</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,padding: 20,backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,fontWeight: "bold",marginBottom: 20,textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  clientItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  clientText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});export default ClientScreen;
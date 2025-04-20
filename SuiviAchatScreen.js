import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import { addSuiviAchat, updateSuiviAchat, deleteSuiviAchat, getSuivisAchat } from "./firebase_achat";

const SuiviAchatScreen = () => {
  const [suivis, setSuivis] = useState([]);
  const [code_article, setCodeArticle] = useState("");
  const [code_fr, setCodeFr] = useState("");
  const [date_achat, setDateAchat] = useState("");
  const [qte_achat, setQteAchat] = useState("");
  const [prix_achat, setPrixAchat] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [articlesExistants, setArticlesExistants] = useState([]);
  const [fournisseursExistants, setFournisseursExistants] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    get(ref(db, "suivi_achat"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSuivis(Object.values(snapshot.val()));
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error getting data: ", error);
      });

    get(ref(db, "fournisseurs"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data).map((f) => Number(f.code_fr));
          setFournisseursExistants(list);
        }
      })
      .catch((error) => {
        console.error("Error getting suppliers: ", error);
      });

    get(ref(db, "articles"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data).map((a) => Number(a.code_article));
          setArticlesExistants(list);
        }
      })
      .catch((error) => {
        console.error("Error getting articles: ", error);
      });
  }, []);

  const handleAddOrUpdate = async () => {
    if (!code_article || !code_fr || !date_achat || !qte_achat || !prix_achat) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const artCode = Number(code_article);
    const frCode = Number(code_fr);

    if (!articlesExistants.includes(artCode)) {
      Alert.alert("Erreur", `L'article ${artCode} n'existe pas.`);
      return;
    }

    if (!fournisseursExistants.includes(frCode)) {
      Alert.alert("Erreur", `Le fournisseur ${frCode} n'existe pas.`);
      return;
    }

    const data = {
      code_article: artCode,
      code_fr: frCode,
      date_achat,
      qte_achat,
      prix_achat,
    };

    if (selectedId) {
      await updateSuiviAchat(selectedId, data);
    } else {
      await addSuiviAchat(artCode, date_achat, qte_achat, prix_achat, frCode);
    }

    clearForm();
  };

  const clearForm = () => {
    setCodeArticle("");
    setCodeFr("");
    setDateAchat("");
    setQteAchat("");
    setPrixAchat("");
    setSelectedId(null);
  };

  const handleSelect = (item) => {
    setCodeArticle(String(item.code_article));
    setCodeFr(String(item.code_fr));
    setDateAchat(item.date_achat);
    setQteAchat(String(item.qte_achat));
    setPrixAchat(String(item.prix_achat));
    setSelectedId(item.id);
  };

  const handleDelete = async (id) => {
    await deleteSuiviAchat(id);
  };
return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Suivi Achats</Text>

      <TextInput
        placeholder="Code Article (int)"
        value={code_article}
        onChangeText={setCodeArticle}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Code Fournisseur (int)"
        value={code_fr}
        onChangeText={setCodeFr}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Date Achat (YYYY-MM-DD)"
        value={date_achat}
        onChangeText={setDateAchat}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantité Achat (int)"
        value={qte_achat}
        onChangeText={setQteAchat}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Prix Achat (float)"
        value={prix_achat}
        onChangeText={setPrixAchat}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        title={selectedId ? "Modifier Suivi" : "Ajouter Suivi"}
        onPress={handleAddOrUpdate}
      />

      <FlatList
        data={suivis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <View style={styles.item}>
              <Text>
                🧾 Article: {item.code_article} | 👤 Fournisseur: {item.code_fr} | 📅 {item.date_achat} | Q: {item.qte_achat} | 💵 {item.prix_achat}
              </Text>
              <Button title="🗑️" onPress={() => handleDelete(item.id)} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SuiviAchatScreen;

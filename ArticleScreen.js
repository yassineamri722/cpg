import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";

// Initialize Firebase Realtime Database
const database = getDatabase();

const ArticleScreen = () => {
  const [articles, setArticles] = useState([]);
  const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);

  // Fetch articles from Firebase Realtime Database
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const articlesRef = ref(database, "articles");
    try {
      const snapshot = await get(articlesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const articleList = Object.keys(data).map(key => ({
          code_article: key,
          lib_article: data[key].lib_article,
        }));
        setArticles(articleList);
      }
    } catch (error) {
      Alert.alert("Erreur", "Problème lors de la récupération des articles.");
    }
  };

  const handleAddOrUpdate = async () => {
    if (!code || !libelle) return;

    try {
      if (selectedCode) {
        // Update article
        await set(ref(database, "articles/" + selectedCode), {
          lib_article: libelle,
        });
      } else {
        // Add new article
        await set(ref(database, "articles/" + code), {
          lib_article: libelle,
        });
      }

      setCode("");
      setLibelle("");
      setSelectedCode(null);
      fetchArticles(); // Refresh article list
    } catch (error) {
      Alert.alert("Erreur", "Problème lors de l'ajout ou modification de l'article.");
    }
  };

  const handleDelete = async (code_article) => {
    try {
      // Remove article from Firebase
      await remove(ref(database, "articles/" + code_article));
      fetchArticles(); // Refresh article list
      Alert.alert("Succès", "Article supprimé.");
    } catch (error) {
      Alert.alert("Erreur", "Problème lors de la suppression de l'article.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Articles</Text>
      <TextInput
        placeholder="Code Article"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      <TextInput
        placeholder="Libellé"
        value={libelle}
        onChangeText={setLibelle}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Ajouter" onPress={handleAddOrUpdate} />
        {selectedCode && (
          <Button
            title="Modifier"
            onPress={handleAddOrUpdate}
          />
        )}
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.code_article}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setCode(item.code_article);
              setLibelle(item.lib_article);
              setSelectedCode(item.code_article);
            }}
          >
            <View style={styles.item}>
              <Text>{item.code_article} - {item.lib_article}</Text>
              <View style={styles.itemButtons}>
                <Button
                  title="Supprimer"
                  color="#d9534f"
                  onPress={() => handleDelete(item.code_article)}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  item: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  itemButtons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ArticleScreen;

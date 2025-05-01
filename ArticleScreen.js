import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Text as RNText } from "react-native";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import styles from "./globalStyles"; // adjust path if needed

const database = getDatabase();

const ArticleScreen = () =>
{
  const [articles, setArticles] = useState([]);
  const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);

  useEffect(() =>
  {
    fetchArticles();
  }, []);

  const fetchArticles = async () =>
  {
    try
    {
      const snapshot = await get(ref(database, "articles"));
      if (snapshot.exists())
      {
        const data = snapshot.val();
        const articleList = Object.keys(data).map((key) => ({
          code_article: key,
          lib_article: data[key].lib_article,
        }));
        setArticles(articleList);
      }
    } catch (error)
    {
      Alert.alert("Erreur", "Problème lors de la récupération des articles.");
    }
  };

  const handleAddOrUpdate = async () =>
  {
    if (!code || !libelle) return;

    try
    {
      await set(ref(database, "articles/" + code), {
        lib_article: libelle,
      });

      setCode("");
      setLibelle("");
      setSelectedCode(null);
      fetchArticles();
    } catch (error)
    {
      Alert.alert("Erreur", "Problème lors de l'ajout ou modification de l'article.");
    }
  };

  const handleDelete = async (code_article) =>
  {
    try
    {
      await remove(ref(database, "articles/" + code_article));
      fetchArticles();
      Alert.alert("Succès", "Article supprimé.");
    } catch (error)
    {
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

      <TouchableOpacity style={styles.primaryBtn} onPress={handleAddOrUpdate}>
        <Text style={styles.btnText}>{selectedCode ? "Modifier" : "Ajouter"}</Text>
      </TouchableOpacity>

      {selectedCode && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() =>
        {
          setCode("");
          setLibelle("");
          setSelectedCode(null);
        }}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={articles}
        keyExtractor={(item) => item.code_article}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.code_article} - {item.lib_article}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                {
                  setCode(item.code_article);
                  setLibelle(item.lib_article);
                  setSelectedCode(item.code_article);
                }}
              >
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.code_article)}
              >
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ArticleScreen;

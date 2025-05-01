import React, { useEffect, useState } from "react";
import
  {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
  } from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import
  {
    addSuiviAchat,
    updateSuiviAchat,
    deleteSuiviAchat,
  } from "./firebase_achat";
import styles from "./globalStyles"; // ← your shared styles

const SuiviAchatScreen = () =>
{
  const [suivis, setSuivis] = useState([]);
  const [codeArticle, setCodeArticle] = useState("");
  const [codeFr, setCodeFr] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [qteAchat, setQteAchat] = useState("");
  const [prixAchat, setPrixAchat] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() =>
  {
    const db = getDatabase();
    get(ref(db, "suivi_achat"))
      .then((snap) =>
      {
        if (snap.exists())
        {
          setSuivis(Object.values(snap.val()));
        }
      })
      .catch((err) => console.error(err));
  }, [suivis]);

  const clearForm = () =>
  {
    setCodeArticle("");
    setCodeFr("");
    setDateAchat("");
    setQteAchat("");
    setPrixAchat("");
    setSelectedId(null);
  };

  const handleSave = async () =>
  {
    if (
      !codeArticle ||
      !codeFr ||
      !dateAchat ||
      !qteAchat ||
      !prixAchat
    )
    {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    const data = {
      code_article: Number(codeArticle),
      code_fr: Number(codeFr),
      date_achat: dateAchat,
      qte_achat: Number(qteAchat),
      prix_achat: Number(prixAchat),
    };

    try
    {
      if (selectedId)
      {
        await updateSuiviAchat(selectedId, data);
      } else
      {
        await addSuiviAchat(data);
      }
      clearForm();
    } catch (err)
    {
      Alert.alert("Erreur", err.message);
    }
  };

  const handleSelect = (item) =>
  {
    setCodeArticle(String(item.code_article));
    setCodeFr(String(item.code_fr));
    setDateAchat(item.date_achat);
    setQteAchat(String(item.qte_achat));
    setPrixAchat(String(item.prix_achat));
    setSelectedId(item.id);
  };

  const handleDelete = async (id) =>
  {
    try
    {
      await deleteSuiviAchat(id);
      clearForm();
    } catch (err)
    {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Suivi Achats</Text>

      <TextInput
        style={styles.input}
        placeholder="Code Article"
        keyboardType="numeric"
        value={codeArticle}
        onChangeText={setCodeArticle}
      />
      <TextInput
        style={styles.input}
        placeholder="Code Fournisseur"
        keyboardType="numeric"
        value={codeFr}
        onChangeText={setCodeFr}
      />
      <TextInput
        style={styles.input}
        placeholder="Date Achat (YYYY-MM-DD)"
        value={dateAchat}
        onChangeText={setDateAchat}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        keyboardType="numeric"
        value={qteAchat}
        onChangeText={setQteAchat}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix Achat"
        keyboardType="numeric"
        value={prixAchat}
        onChangeText={setPrixAchat}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleSave}
      >
        <Text style={styles.btnText}>
          {selectedId ? "Modifier Suivi" : "Ajouter Suivi"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={suivis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                🧾 {item.code_article} | 👤 {item.code_fr} | 📅 {item.date_achat} | Q: {item.qte_achat} | 💵 {item.prix_achat}
              </Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.btnText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SuiviAchatScreen;

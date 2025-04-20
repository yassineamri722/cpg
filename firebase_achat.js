import { getDatabase, ref, set, update, remove, get, child, push, onValue } from 'firebase/database';
import { app } from './firebaseconfig'; // ton fichier firebaseConfig.js où tu initialises firebase app

const db = getDatabase(app);

// ➕ Ajouter un article
export const addArticle = (code_article, lib_article) => {
    const codeInt = parseInt(code_article, 10);
    return set(ref(db, `articles/${codeInt}`), {
      code_article: codeInt,
      lib_article,
    });
};

// 📥 Récupérer tous les articles
export const getArticles = async () => {
    const snapshot = await get(ref(db, 'articles'));
    const articles = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const code in data) {
        articles.push({
          code_article: parseInt(code, 10), // clé convertie en entier
          lib_article: data[code].lib_article,
        });
      }
    }
    return articles;
};

// ✏️ Mettre à jour un article
export const updateArticle = (code_article, lib_article) => {
    const codeInt = parseInt(code_article, 10);
    return update(ref(db, `articles/${codeInt}`), {
      lib_article,
    });
};

// ❌ Supprimer un article
export const deleteArticle = (code_article) => {
    const codeInt = parseInt(code_article, 10);
    return remove(ref(db, `articles/${codeInt}`));
};

// ➕ Ajouter un fournisseur avec un code_fr personnalisé
export const addFournisseur = (code_fr, lib_fr, tel_fr, adress_fr) => {
    return set(ref(db, `fournisseurs/${code_fr}`), {
      code_fr,       // Utilise le code_fr saisi par l'utilisateur
      lib_fr,
      tel_fr: Number(tel_fr),  // Assurez-vous que tel_fr est un nombre
      adress_fr,
    });
  };

// 📥 Récupérer tous les fournisseurs
export const getFournisseurs = async () => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'fournisseurs'));
  const fournisseurs = [];

  if (snapshot.exists()) {
    const data = snapshot.val();
    Object.keys(data).forEach(key => {
      fournisseurs.push({
        code_fr: key,  // Utilise l'ID généré automatiquement par push
        lib_fr: data[key].lib_fr,
        tel_fr: Number(data[key].tel_fr),
        adress_fr: data[key].adress_fr,
      });
    });
  }

  return fournisseurs;
};

// ✏️ Mettre à jour un fournisseur en utilisant code_fr saisi
export const updateFournisseur = (code_fr, lib_fr, tel_fr, adress_fr) => {
    return update(ref(db, `fournisseurs/${code_fr}`), {
      lib_fr,
      tel_fr: Number(tel_fr),
      adress_fr,
    });
  };
// ❌ Supprimer un fournisseur en utilisant code_fr saisi
export const deleteFournisseur = (code_fr) => {
    return remove(ref(db, `fournisseurs/${code_fr}`));
  };

// ➕ Ajouter un suivi achat
export const addSuiviAchat = (code_fr, code_article, date_achat, qte_achat, prix_achat) => {
  const id = push(ref(db, 'suivi_achat')).key;
  return set(ref(db, `suivi_achat/${id}`), {
    code_fr: Number(code_fr),
    code_article: Number(code_article),
    date_achat,
    qte_achat: Number(qte_achat),
    prix_achat: Number(prix_achat),
  });
};

// 🔄 Mettre à jour un suivi achat
export const updateSuiviAchat = (id, suivi) => {
  const updated = {
    code_fr: Number(suivi.code_fr),
    code_article: Number(suivi.code_article),
    date_achat: suivi.date_achat,
    qte_achat: Number(suivi.qte_achat),
    prix_achat: Number(suivi.prix_achat),
  };
  return update(ref(db, `suivi_achat/${id}`), updated);
};

// ❌ Supprimer un suivi achat
export const deleteSuiviAchat = (id) => {
  return remove(ref(db, `suivi_achat/${id}`));
};

// 📥 Get all
export const getSuivisAchat = (callback) => {
  onValue(ref(db, 'suivi_achat'), (snapshot) => {
    const data = snapshot.val() || {};
    const result = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    callback(result);
  });
};

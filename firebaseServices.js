import { ref, set, get, update } from 'firebase/database';
import { database } from './firebaseconfig'; 

// Fonction pour ajouter un produit
export const addProduit = async (codeProduit, libelleProduit) => {
  const produitRef = ref(database, 'produit/' + codeProduit); // Chaque produit est identifié par son code
  try {
    await set(produitRef, {
      code_produit: codeProduit,
      libelle_produit: libelleProduit,
    });
    console.log('Produit ajouté:', { codeProduit, libelleProduit });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
  }
};
// Fonction pour récupérer un produit
export const getProduit = async (codeProduit) => {
    const produitRef = ref(database, 'produit/' + codeProduit);
    try {
      const snapshot = await get(produitRef);
      if (snapshot.exists()) {
        return snapshot.val();  // Retourne le produit
      } else {
        console.log("Produit non trouvé.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error);
      return null;
    }
  };
  // Fonction pour récupérer tous les produits
export const getProduits = async () => {
    const produitsRef = ref(database, 'produit');
    try {
      const snapshot = await get(produitsRef);
      if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));
      } else {
        console.log("Aucun produit trouvé.");
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return [];
    }
  };
  // Fonction pour supprimer un produit
export const deleteProduit = async (codeProduit) => {
    const produitRef = ref(database, 'produit/' + codeProduit);
    const suiviRef = ref(database, 'suivi_produit');
  
    try {
      // Supprimer le produit
      await set(produitRef, null);
  
      // Supprimer les suivis associés à ce produit
      const snapshot = await get(suiviRef);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const suivi = childSnapshot.val();
          if (suivi.code_produit === codeProduit) {
            set(ref(database, 'suivi_produit/' + childSnapshot.key), null);
          }
        });
      }
      console.log('Produit supprimé avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };
 
  // Fonction pour mettre à jour un produit
  export const updateProduit = async (codeProduit, updatedData) => {
    const produitRef = ref(database, 'produit/' + codeProduit);  // Référence du produit à mettre à jour
    try {
      await update(produitRef, updatedData);  // Mise à jour du produit avec les nouvelles données
      console.log("Produit mis à jour:", { codeProduit, ...updatedData });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
    }
  };
  

// Fonction pour ajouter un siège
export const addSiege = async (idSiege, libelleSiege, tel, adresse) => {
  const siegeRef = ref(database, 'siege/' + idSiege); // Chaque siège est identifié par son ID
  try {
    await set(siegeRef, {
      id_siege: idSiege,
      libelle_siege: libelleSiege,
      tel: tel,
      adresse: adresse,
    });
    console.log('Siège ajouté:', { idSiege, libelleSiege, tel, adresse });
  } catch (error) {
    console.error("Erreur lors de l'ajout du siège :", error);
  }
};

// Fonction pour récupérer un siège
export const getSiege = async (idSiege) => {
  const siegeRef = ref(database, 'siege/' + idSiege);
  try {
    const snapshot = await get(siegeRef);
    if (snapshot.exists()) {
      return snapshot.val();  // Retourne le siège
    } else {
      console.log("Siège non trouvé.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du siège :", error);
    return null;
  }
};

// Fonction pour récupérer tous les sièges
export const getSieges = async () => {
  const siegesRef = ref(database, 'siege');
  try {
    const snapshot = await get(siegesRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
    } else {
      console.log("Aucun siège trouvé.");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des sièges :", error);
    return [];
  }
};

// Fonction pour supprimer un siège
export const deleteSiege = async (idSiege) => {
  const siegeRef = ref(database, 'siege/' + idSiege);
  try {
    await set(siegeRef, null);  // Supprime le siège
    console.log('Siège supprimé avec succès');
  } catch (error) {
    console.error("Erreur lors de la suppression du siège :", error);
  }
};

// Fonction pour mettre à jour un siège
export const updateSiege = async (idSiege, updatedData) => {
  const siegeRef = ref(database, 'siege/' + idSiege);
  try {
    await update(siegeRef, updatedData);  // Mise à jour du siège
    console.log("Siège mis à jour:", { idSiege, ...updatedData });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du siège :", error);
  }
};


// Fonction pour ajouter un suivi produit
export const addSuiviProduit = async (codeProduit, idSiege, quantite) => {
    const suiviRef = ref(database, 'suivi_produit/' + codeProduit + '_' + idSiege);
  
    const data = {
      code_produit: codeProduit,
      id_siege: idSiege,
      quantite: quantite ?? 0,
      user_saisie: "admin"  // ou un nom fixe, mais jamais undefined
    };
  
    try {
      await set(suiviRef, data);
      console.log("Suivi produit ajouté avec succès :", data);
    } catch (error) {
      console.error("Erreur lors de l'ajout du suivi produit :", error);
      throw error;
    }
  };
  
  // Fonction pour récupérer un suivi produit spécifique
export const getSuiviProduit = async (codeProduit, idSiege) => {
    const suiviRef = ref(database, 'suivi_produit/' + codeProduit + '_' + idSiege);
    try {
      const snapshot = await get(suiviRef);
      if (snapshot.exists()) {
        return snapshot.val();  // Retourne le suivi produit
      } else {
        console.log("Suivi produit non trouvé.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du suivi produit :", error);
      return null;
    }
  };
  // Fonction pour récupérer tous les suivis produits
export const getSuiviProduits = async () => {
    const suiviRef = ref(database, 'suivi_produit');
    try {
      const snapshot = await get(suiviRef);
      if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));
      } else {
        console.log("Aucun suivi produit trouvé.");
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des suivis produits :", error);
      return [];
    }
  };
  // Fonction pour mettre à jour un suivi produit
export const updateSuiviProduit = async (codeProduit, idSiege, updatedData) => {
    const suiviRef = ref(database, 'suivi_produit/' + codeProduit + '_' + idSiege); // Référence du suivi produit
    try {
      await update(suiviRef, updatedData);
      console.log("Suivi produit mis à jour:", { codeProduit, idSiege, ...updatedData });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du suivi produit :", error);
    }
  };
  // Fonction pour supprimer un suivi produit
export const deleteSuiviProduit = async (codeProduit, idSiege) => {
    const suiviRef = ref(database, 'suivi_produit/' + codeProduit + '_' + idSiege);  // Référence du suivi produit
    try {
      await set(suiviRef, null);  // Supprime le suivi produit
      console.log('Suivi produit supprimé avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression du suivi produit :", error);
    }
  };


  export const checkSuiviProduitBySiege = async (idSiege) => {
    const suiviRef = ref(database, 'suivi_produit');
    try {
      const snapshot = await get(suiviRef);
      if (snapshot.exists()) {
        const suivis = snapshot.val();
        // Vérifie si le idSiege existe dans l'un des suivis produits
        return Object.values(suivis).some(suivi => suivi.id_siege === idSiege);
      }
      return false; // Aucun suivi produit trouvé
    } catch (error) {
      console.error("Erreur lors de la vérification du suivi produit :", error);
      return false;
    }
  };
  
  
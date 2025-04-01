import database from "@react-native-firebase/database";

//  Lire tous les produits
export const getProduits = async () => {
    try {
        const snapshot = await database().ref("/produit").once("value");
        if (snapshot.exists()) {
            return Object.entries(snapshot.val()).map(([id, data]) => ({
                id,
                ...data,
            }));
        }
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        return [];
    }
};

//  Ajouter un produit
export const addProduit = async (nom, siegeID, type) => {
    try {
        const newRef = database().ref("/produit").push();
        await newRef.set({
            nom,
            siegeID,
            type,
        });
        return newRef.key; // Retourne l'ID du produit ajouté
    } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
    }
};

// Mettre à jour un produit
export const updateProduit = async (id, updatedData) => {
    try {
        await database().ref(`/produit/${id}`).update(updatedData);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du produit :", error);
    }
};

// Supprimer un produit
export const deleteProduit = async (id) => {
    try {
        await database().ref(`/produit/${id}`).remove();
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
    }
};

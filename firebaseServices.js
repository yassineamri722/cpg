import { ref, set, get } from "firebase/database";
import { database } from './firebaseconfig'; // Import the database

// Function to add a product
export const addProduit = async (nom, siegeID, type) => {
    const newProduitRef = ref(database, 'produit/' + Date.now()); // Generate a unique ID using timestamp
    try {
        await set(newProduitRef, {
            nom,
            siegeID,
            type,
        });
        return newProduitRef.key; // Return the product ID
    } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
    }
};

// Function to get all products
export const getProduits = async () => {
    const produitsRef = ref(database, 'produit');
    try {
        const snapshot = await get(produitsRef);
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

// Function to update a product
export const updateProduit = async (id, updatedData) => {
    const produitRef = ref(database, 'produit/' + id);
    try {
        await set(produitRef, updatedData);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du produit :", error);
    }
};

// Function to delete a product
export const deleteProduit = async (id) => {
    const produitRef = ref(database, 'produit/' + id);
    try {
        await set(produitRef, null); // Deleting by setting the reference to null
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
    }
};

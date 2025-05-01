import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { ref, get } from "firebase/database";
import { database } from "./firebaseconfig"; // Assurez-vous d'importer la configuration Firebase
import { getAuth } from "firebase/auth"; // Importer Firebase Authentication

function UserProfileScreen()
{
    const [profile, setProfile] = useState({ matricule: "", name: "", email: "" });
    const [suiviProfiles, setSuiviProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Récupérer l'utilisateur connecté à partir de Firebase Auth
    const auth = getAuth();
    const user = auth.currentUser;

    // Vérifier si un utilisateur est connecté
    useEffect(() =>
    {
        if (user)
        {
            fetchUserProfile(user.email); // Utilisez l'email de l'utilisateur connecté pour récupérer les profils suivis
        } else
        {
            Alert.alert("Erreur", "Aucun utilisateur connecté.");
        }
    }, []);

    // Fonction pour récupérer le profil de l'utilisateur à partir de l'email
    const fetchUserProfile = (email) =>
    {
        setIsLoading(true);
        const profileRef = ref(database, "users/");
        get(profileRef)
            .then((snapshot) =>
            {
                let userProfile = null;
                snapshot.forEach((childSnapshot) =>
                {
                    const userData = childSnapshot.val();
                    if (userData.email === email)
                    {
                        userProfile = userData;
                    }
                });

                if (userProfile)
                {
                    setProfile(userProfile);
                    fetchSuiviProfiles(userProfile.matricule); // Récupérer les profils suivis si l'utilisateur est trouvé
                } else
                {
                    Alert.alert("Erreur", "Profil non trouvé.");
                }
                setIsLoading(false);
            })
            .catch((error) =>
            {
                Alert.alert("Erreur", "Échec de la récupération du profil.");
                console.error(error);
                setIsLoading(false);
            });
    };

    // Fonction pour récupérer les profils suivis par l'utilisateur
    const fetchSuiviProfiles = (matricule) =>
    {
        const suiviRef = ref(database, `suivi_profiles/${matricule}`);
        get(suiviRef)
            .then((snapshot) =>
            {
                if (snapshot.exists())
                {
                    setSuiviProfiles(Object.values(snapshot.val())); // Assurez-vous que la structure des données est correcte
                } else
                {
                    Alert.alert("Erreur", "Aucun profil suivi trouvé.");
                }
            })
            .catch((error) =>
            {
                Alert.alert("Erreur", "Échec de la récupération des profils suivis.");
                console.error(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil Utilisateur</Text>

            {isLoading ? (
                <Text>Chargement...</Text>
            ) : (
                <View>
                    {/* Affichage du profil utilisateur */}
                    <Text>Matricule: {profile.matricule}</Text>
                    <Text>Nom: {profile.name}</Text>
                    <Text>Email: {profile.email}</Text>

                    {/* Affichage des profils suivis */}
                    <Text style={styles.subtitle}>Profils Suivis:</Text>
                    {suiviProfiles.length > 0 ? (
                        suiviProfiles.map((suivi, index) => (
                            <View key={index} style={styles.suiviContainer}>
                                <Text>Matricule: {suivi.matricule}</Text>
                                <Text>Nom: {suivi.name}</Text>
                                <Text>Email: {suivi.email}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>Aucun profil suivi.</Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
    },
    suiviContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 5,
    },
});

export default UserProfileScreen;

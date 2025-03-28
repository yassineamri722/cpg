import React from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Assurez-vous que le chemin de l'image est correct
const image = require('./assets/شركة-فسفاط-قفصة.jpg');  // Remplacez par le chemin de votre image

function HomeScreen() {
    const navigation = useNavigation();

    return (
        <ImageBackground source={image} style={styles.image}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to the Home Screen</Text>

                <View style={styles.card}>
                    <Text style={styles.cardText}>
                        Manage your candidates, products, and sales here!
                    </Text>
                </View>

                {/* Navigation Buttons Container */}
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button title="candidats" onPress={() => navigation.navigate("Candidats")} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button title="Produits" onPress={() => navigation.navigate("Produits")} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button title="Ventes" onPress={() => navigation.navigate("Produit vendu")} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button title="Achats" onPress={() => navigation.navigate("Article acheté")} />
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,  // Permet à l'image de couvrir tout l'écran
        justifyContent: "center", // Centre le contenu
        alignItems: "center", // Centre horizontalement
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(242, 242, 242, 0.8)",  // Ajout d'une transparence à l'arrière-plan pour que l'image ne gêne pas la lisibilité
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: "90%",
        maxWidth: 400,
        alignItems: "center",
    },
    cardText: {
        fontSize: 18,
        color: "#555",
        textAlign: "center",
    },
    buttonContainer: {
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },
    buttonWrapper: {
        width: "100%",
        marginVertical: 8,
        borderRadius: 8,
        overflow: "hidden",
    },
});

export default HomeScreen;

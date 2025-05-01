import React, { useLayoutEffect } from "react";
import
    {
        View,
        Text,
        ImageBackground,
    } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import LogoutButton from "./LogoutButton";
import styles from "./HomeScreenStyles";

const image = require("./assets/شركة-فسفاط-قفصة.jpg");

function HomeScreen()
{
    const navigation = useNavigation();
    const route = useRoute();
    const { role } = route.params || {};

    // Add logout button in header
    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerRight: () => <LogoutButton />,
            headerStyle: { backgroundColor: "#3f51b5" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
        });
    }, [navigation]);

    // Redirect employees directly
    if (role === "employee")
    {
        navigation.navigate("DashboardEmployee");
    }

    return (
        <ImageBackground source={image} style={styles.image}>
            <LinearGradient
                colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"]}
                style={styles.gradientOverlay}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Bienvenue {role === "admin" ? "Admin" : "Employé"} !
                    </Text>

                    <View style={styles.card}>
                        <Text style={styles.cardText}>
                            {role === "admin"
                                ? "Gérez vos candidats, produits, ventes et audits ici !"
                                : "Gérez votre profil candidat ici !"}
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {role === "admin" && (
                            <>
                                {["ProduitsTabs", "VentesTabs", "AchatsTabs", "AuditTabs", "CandidatsTabs"].map((screen, index) => (
                                    <PaperButton
                                        key={index}
                                        mode="contained"
                                        style={styles.styledButton}
                                        onPress={() => navigation.navigate(screen)}
                                    >
                                        {screen.replace("Tabs", "")}
                                    </PaperButton>
                                ))}
                            </>
                        )}

                        {role === "employee" && (
                            <PaperButton
                                mode="contained"
                                style={styles.styledButton}
                                onPress={() => navigation.navigate("userprofile")}
                            >
                                Accéder au Dashboard
                            </PaperButton>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

export default HomeScreen;

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function SuiviProductScreen({ route, navigation })
{
    const { productId } = route.params;

    // Simulated Suivi Product data
    const suiviData = {
        "1": [
            { date: "2025-01-25", update: "Product shipped" },
            { date: "2025-01-26", update: "Product in transit" },
        ],
        "2": [
            { date: "2025-02-10", update: "Product restocked" },
            { date: "2025-02-12", update: "Product shipped" },
        ],
        "3": [
            { date: "2025-03-05", update: "Product received" },
            { date: "2025-03-06", update: "Product checked" },
        ],
    };

    const suivi = suiviData[productId] || [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product Tracking</Text>
            {suivi.length > 0 ? (
                suivi.map((update, index) => (
                    <View key={index} style={styles.updateCard}>
                        <Text style={styles.updateDate}>Date: {update.date}</Text>
                        <Text>Update: {update.update}</Text>
                    </View>
                ))
            ) : (
                <Text>No tracking updates available.</Text>
            )}

           
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    updateCard: { padding: 15, marginBottom: 10, backgroundColor: "#fff", borderRadius: 5, borderWidth: 1, borderColor: "#ccc" },
    updateDate: { fontWeight: "bold" },
});

export default SuiviProductScreen;

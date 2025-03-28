import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function SiegeScreen({ route, navigation })
{
    const { productId } = route.params;

    // Simulated Siege data
    const productSiege = {
        "1": { location: "Warehouse A", status: "In Stock" },
        "2": { location: "Warehouse B", status: "Out of Stock" },
        "3": { location: "Warehouse C", status: "In Stock" },
    };

    const siege = productSiege[productId] || {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product Siege</Text>
            <Text style={styles.info}>Location: {siege.location}</Text>
            <Text style={styles.info}>Status: {siege.status}</Text>

            <Button title=" Suivi Produit" onPress={() => navigation.navigate("SuiviProductScreen", { productId })} />
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    info: { fontSize: 18, marginBottom: 10 },
});

export default SiegeScreen;

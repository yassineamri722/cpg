import React from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";

function ProductsScreen({ navigation })
{
    // Simulated products data
    const products = [
        { id: "1", name: "Produit A" },
        { id: "2", name: "Produit B" },
        { id: "3", name: "Produit C" },
    ];

    const renderProduct = ({ item }) =>
    {
        return (
            <TouchableOpacity onPress={() => navigation.navigate("SiegeScreen", { productId: item.id })}>
                <View style={styles.productCard}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Button title=" Siège" onPress={() => navigation.navigate("Siège", { productId: item.id })} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Products</Text>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    productCard: { padding: 15, backgroundColor: "#fff", marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: "#ccc" },
    productName: { fontSize: 18, fontWeight: "bold" },
});

export default ProductsScreen;

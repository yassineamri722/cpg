import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function UsersScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Users Screen</Text>
            <Button 
                title="Profiles"
                onPress={() => navigation.navigate("profiles")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default UsersScreen;

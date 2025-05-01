import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: "100%",
    },
    gradientOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    container: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#3f51b5",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#e3f2fd",
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        width: "100%",
        alignItems: "center",
    },
    cardText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    styledButton: {
        marginVertical: 6,
        width: "100%",
        borderRadius: 8,
    },
});

export default styles;

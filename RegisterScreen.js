import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [matricule, setMatricule] = useState("");
    const [role, setRole] = useState(""); // Exemple: "admin" ou "employee"
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !matricule || !role) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        const auth = getAuth();
        const db = getDatabase();

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Save additional user info in Realtime Database
            await set(ref(db, `users/${uid}`), {
                email,
                role,
                matricule_user: matricule,
            });

            Alert.alert("Success", "Account created successfully!");
            navigation.replace("Home", { role });
        } catch (err) {
            console.error("Registration Error:", err);
            Alert.alert("Registration failed", err.message || "Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Matricule"
                value={matricule}
                onChangeText={setMatricule}
            />

            <TextInput
                style={styles.input}
                placeholder="Role (admin or employee)"
                value={role}
                onChangeText={setRole}
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={[styles.button, loading && { backgroundColor: "#ccc" }]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Registering..." : "Register"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.registerLink}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F5F5F5" },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 40 },
  input: { width: "100%", padding: 12, marginBottom: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fff", fontSize: 16 },
  error: { color: "red", marginBottom: 10, fontSize: 14 },
  button: { backgroundColor: "#007BFF", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
  registerLink: { color: "#007BFF", fontSize: 16 },
});

export default RegisterScreen;

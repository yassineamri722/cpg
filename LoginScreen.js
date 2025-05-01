import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

function LoginScreen({ navigation })
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  // state for loading indicator

  const handleLogin = async () =>
  {
    const auth = getAuth();
    const db = getDatabase();
    setLoading(true);  // set loading to true when login starts

    try
    {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Now fetch the user role from the database
      const snapshot = await get(ref(db, `users/${uid}`));

      if (snapshot.exists())
      {
        const userData = snapshot.val();
        const userRole = userData.role;

        // Redirect based on role
        navigation.replace("Home", { role: userRole });
      }
      else
      {
        setError("No user role found.");
      }
    }
    catch (err)
    {
      console.error(err);
      setError("Login failed. Check your credentials.");
    }
    finally
    {
      setLoading(false);  // set loading to false after login attempt
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>Don't have an account? Register</Text>
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

export default LoginScreen;

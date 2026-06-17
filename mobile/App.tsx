import { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, getProviders } from "./lib/api";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const restoreToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setScreen("providers");
        fetchProviders(savedToken);
      }
    };
    restoreToken();
  }, []);

  const fetchProviders = async (authToken: string) => {
    try {
      setLoading(true);
      const data = await getProviders(authToken);
      setProviders(data);
      setError("");
    } catch (err) {
      setError("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginUser(email, password);
      await AsyncStorage.setItem("token", response.token);
      setToken(response.token);
      setScreen("providers");
      fetchProviders(response.token);
      setError("");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setEmail("");
    setPassword("");
    setScreen("landing");
  };

  if (screen === "landing") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>SewaLink</Text>
          <Text style={styles.subtitle}>Discover local professionals and book services in Nepal.</Text>
          <TouchableOpacity style={styles.button} onPress={() => setScreen("login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setScreen("register")}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Login</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen("landing")}>
            <Text style={styles.link}>Back to landing</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "providers") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Providers</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {loading ? (
            <ActivityIndicator size="large" color="#06b6d4" />
          ) : providers.length > 0 ? (
            providers.map((provider) => (
              <View key={provider.id} style={styles.providerCard}>
                <Text style={styles.providerName}>{provider.displayName}</Text>
                <Text style={styles.providerHeadline}>{provider.headline}</Text>
                <Text style={styles.rating}>⭐ {provider.rating.toFixed(1)}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.subtitle}>No providers available</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
        <TouchableOpacity onPress={() => setScreen("landing")}>
          <Text style={styles.link}>Back to landing</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 16, backgroundColor: "#111827" },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  title: { color: "#f8fafc", fontSize: 32, fontWeight: "800", marginBottom: 12 },
  subtitle: { color: "#cbd5e1", fontSize: 16, marginBottom: 24 },
  input: { backgroundColor: "#1e293b", color: "#fff", padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "#334155" },
  button: { backgroundColor: "#06b6d4", paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginBottom: 12 },
  buttonText: { color: "#0f172a", fontSize: 16, fontWeight: "700", textAlign: "center" },
  secondaryButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#334155" },
  secondaryButtonText: { color: "#cbd5e1" },
  link: { color: "#06b6d4", fontSize: 16, marginTop: 12, textAlign: "center" },
  error: { color: "#f87171", fontSize: 14, marginBottom: 12 },
  logout: { color: "#f87171", fontSize: 14, fontWeight: "600" },
  providerCard: { backgroundColor: "#111827", borderRadius: 12, padding: 16, marginBottom: 12 },
  providerName: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  providerHeadline: { color: "#cbd5e1", fontSize: 14, marginBottom: 8 },
  rating: { color: "#06b6d4", fontSize: 14, fontWeight: "600", marginBottom: 12 },
});

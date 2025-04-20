import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Auth Screens
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

// Home
import HomeScreen from "./HomeScreen";

// Produits
import ProductsScreen from "./ProductsScreen";
import SiegeScreen from "./SiegeScreen";
import SuiviProductScreen from "./SuiviProductScreen";

// Ventes
import ProduitsVendusScreen from "./ProduitsVendusScreen";
import ClientScreen from "./ClientScreen";
import SuiviVenteScreen from "./SuiviVenteScreen";

// Achats
import ArticleScreen from "./ArticleScreen";
import FournisseurScreen from "./FournisseurScreen";
import SuiviAchatScreen from "./SuiviAchatScreen";

// Candidats
import UserScreen from "./UsersScreen";
import ProfileScreen from "./ProfilesScreen";
import SuiviProfileScreen from "./SuiviProfileScreen";
//audit
import TypeAuditScreen from "./TypeAuditScreen";
import SuiviAuditScreen from "./SuiviAuditScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Onglets Produits
function ProduitsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Produits" component={ProductsScreen} options={{ title: "Produits" }} />
      <Tab.Screen name="Siege" component={SiegeScreen} options={{ title: "Sièges" }} />
      <Tab.Screen name="SuiviProduit" component={SuiviProductScreen} options={{ title: "Suivi Produit" }} />
    </Tab.Navigator>
  );
}

// Onglets Candidats
function CandidatsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Users" component={UserScreen} options={{ title: "Employés" }} />
      <Tab.Screen name="Profiles" component={ProfileScreen} options={{ title: "Profils" }} />
      <Tab.Screen name="SuiviProfile" component={SuiviProfileScreen} options={{ title: "Suivi Profil" }} />
    </Tab.Navigator>
  );
}

// Onglets Ventes
function VentesTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Client" component={ClientScreen} options={{ title: "Clients" }} />
      <Tab.Screen name="ProduitsVendus" component={ProduitsVendusScreen} options={{ title: "Produits Vendus" }} />
      <Tab.Screen name="SuiviVente" component={SuiviVenteScreen} options={{ title: "Suivi Vente" }} />
    </Tab.Navigator>
  );
}
function AuditTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sièges" component={SiegeScreen} options={{ title: "Siège" }}  />
      <Tab.Screen name="TypeAudit" component={TypeAuditScreen} options={{ title: "Types Audit" }} />
      <Tab.Screen name="SuiviAudit" component={SuiviAuditScreen} options={{ title: "Suivi Audit" }} />
    </Tab.Navigator>
  );
}
// Onglets Achats
function AchatsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Article" component={ArticleScreen} options={{ title: "Articles" }} />
      <Tab.Screen name="Fournisseur" component={FournisseurScreen} options={{ title: "Fournisseurs" }} />
      <Tab.Screen name="SuiviAchat" component={SuiviAchatScreen} options={{ title: "Suivi Achat" }} />
    </Tab.Navigator>
  );
}

// App principale
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        {/* Authentification */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Accueil */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />

        {/* Onglets Produits */}
        <Stack.Screen name="ProduitsTabs" component={ProduitsTabs} options={{ title: "Produits" }} />

        {/* Onglets Candidats */}
        <Stack.Screen name="CandidatsTabs" component={CandidatsTabs} options={{ title: "Candidats" }} />

        {/* Onglets Ventes */}
        <Stack.Screen name="VentesTabs" component={VentesTabs} options={{ title: "Ventes" }} />

        {/* Onglets Achats */}
        <Stack.Screen name="AchatsTabs" component={AchatsTabs} options={{ title: "Achats" }} />
        {/* Onglets Audit */}
        <Stack.Screen name="AuditTabs" component={AuditTabs} options={{ title: "Audit" }} />

        {/* Produits */}
        <Stack.Screen name="Produits" component={ProductsScreen} />
        <Stack.Screen name="Siege" component={SiegeScreen} />
        <Stack.Screen name="SuiviProductScreen" component={SuiviProductScreen} />

        {/* Achats */}
        <Stack.Screen name="Article acheté" component={ArticleScreen} />
        <Stack.Screen name="Fournisseur" component={FournisseurScreen} />
        <Stack.Screen name="SuiviAchat" component={SuiviAchatScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

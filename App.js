import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomeScreen from "./HomeScreen"; 
import CandidatesScreen from "./CandidatesScreen"; 
import ProductsScreen from "./ProductsScreen"; 
import SiegeScreen from "./SiegeScreen"; 
import SuiviProductScreen from "./SuiviProductScreen"; 
import ProduitsVendusScreen from "./ProduitsVendusScreen"; 
import ArticleScreen from "./ArticleScreen";
import ClientScreen from "./ClientScreen";
import SuiviVenteScreen from "./SuiviVenteScreen";
import FournisseurScreen from "./FournisseurScreen";
import SuiviAchatScreen from "./SuiviAchatScreen"; 

const Stack = createStackNavigator();

export default function App()
{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Authentication Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Main App Screens after successful login */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Candidats" component={CandidatesScreen} />

        {/* Products Screens */}
        <Stack.Screen name="Produits" component={ProductsScreen} />
        <Stack.Screen name="Siège" component={SiegeScreen} />
        <Stack.Screen name="SuiviProductScreen" component={SuiviProductScreen} />

        {/* Sales Screens */}
     
        <Stack.Screen name="Produit vendu" component={ProduitsVendusScreen} />
        <Stack.Screen name="Client" component={ClientScreen} />
        <Stack.Screen name="SuiviVente" component={SuiviVenteScreen} />
        

        {/* Purchases Screens */}
        
        <Stack.Screen name="Article acheté" component={ArticleScreen} />
        <Stack.Screen name="Fournisseur" component={FournisseurScreen} />
        <Stack.Screen name="SuiviAchat" component={SuiviAchatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

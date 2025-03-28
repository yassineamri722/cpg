import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UsersScreen from "./UsersScreen";
import ProfilesScreen from "./ProfilesScreen";

const Tab = createMaterialTopTabNavigator();

function CandidatesScreen()
{
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: "#318CE7" }, // Couleur de l'onglet
                tabBarLabelStyle: { color: "white", fontWeight: "bold" }, // Style du texte
            }}
        >
            <Tab.Screen name="Users" component={UsersScreen} />
            <Tab.Screen name="Profiles" component={ProfilesScreen} />
        </Tab.Navigator>
    );
}

export default CandidatesScreen;

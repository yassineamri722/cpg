import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const LogoutButton = () =>
{
    const navigation = useNavigation();

    const handleLogout = () =>
    {
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Icon name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
    );
};

export default LogoutButton;

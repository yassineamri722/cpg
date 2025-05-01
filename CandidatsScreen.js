import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { db } from '../firebaseconfig'; // Assurez-vous que ce fichier est configuré correctement
import { collection, query, where, getDocs } from 'firebase/firestore';

const CandidatsScreen = ({ navigation, userId }) =>
{
    const [profiles, setProfiles] = useState([]);


    useEffect(() =>
    {
        const fetchProfiles = async () =>
        {
            try
            {
                const profilesRef = collection(db, 'suivi_profiles');
                const q = query(profilesRef, where('assignedTo', '==', userId)); // Récupérer les profils assignés à cet employé

                const querySnapshot = await getDocs(q);
                const fetchedProfiles = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setProfiles(fetchedProfiles);
            } catch (error)
            {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();
    }, [userId]);

    const handleProfileClick = (profileId) =>
    {
        navigation.navigate('ProfileDetail', { profileId });
    };

    const handleCreateProfile = () =>
    {
        navigation.navigate('CreateProfile');
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>My Candidats</Text>

            <Button title="Create New Profile" onPress={handleCreateProfile} />

            <FlatList
                data={profiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 15 }}>
                        <Text>{item.name}</Text>
                        <Button title="View/Edit" onPress={() => handleProfileClick(item.id)} />
                    </View>
                )}
            />
        </View>
    );
};

export default CandidatsScreen;

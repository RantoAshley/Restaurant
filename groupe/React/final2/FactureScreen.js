import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db, functions } from './App'; // Import des services Firebase
import { collection, addDoc } from 'firebase/firestore'; // Pour Firestore
import { httpsCallable } from 'firebase/functions'; // Pour Firebase Functions

const FactureScreen = ({ route }) => {
    const { userName, totalPrice, orders } = route.params;
    const [isLoading, setIsLoading] = useState(false); // Pour gérer l'état de chargement

    // Fonction pour enregistrer la facture dans Firestore
    const saveFactureToFirestore = async () => {
        try {
            const factureRef = collection(db, 'factures'); // Référence à la collection 'factures'
            await addDoc(factureRef, {
                userName,
                totalPrice,
                orders,
                date: new Date().toISOString(), // Ajoute la date de la facture
            });
            console.log('Facture enregistrée dans Firestore !');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la facture : ', error);
            Alert.alert('Erreur', 'Impossible d\'enregistrer la facture.');
        }
    };

    // Fonction pour appeler une Firebase Function
    const callPaymentFunction = async () => {
        try {
            const processPayment = httpsCallable(functions, 'processPayment'); // Nom de la fonction cloud
            const result = await processPayment({
                userName,
                totalPrice,
                orders,
            });
            console.log('Résultat de la fonction : ', result.data);
            return result.data;
        } catch (error) {
            console.error('Erreur lors de l\'appel de la fonction : ', error);
            Alert.alert('Erreur', 'Le paiement a échoué.');
            throw error;
        }
    };

    // Fonction pour gérer le paiement
    const handlePayment = async () => {
        setIsLoading(true); // Active l'état de chargement

        try {
            // Enregistrer la facture dans Firestore
            await saveFactureToFirestore();

            // Appeler la Firebase Function pour traiter le paiement
            const paymentResult = await callPaymentFunction();

            // Afficher une alerte de succès
            Alert.alert(
                'Paiement réussi !',
                `${userName}, votre commande a bien été payée.`,
                [{ text: 'OK' }]
            );

            console.log('Paiement traité avec succès : ', paymentResult);
        } catch (error) {
            console.error('Erreur lors du paiement : ', error);
        } finally {
            setIsLoading(false); // Désactive l'état de chargement
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Facture</Text>

            <Text style={styles.userName}>Utilisateur: {userName}</Text>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
                    </View>
                )}
            />

            <Text style={styles.totalPrice}>Total: ${totalPrice}</Text>

            {/* Bouton Payer */}
            <TouchableOpacity
                style={styles.payButton}
                onPress={handlePayment} // Appelle la fonction handlePayment
                disabled={isLoading} // Désactive le bouton pendant le chargement
            >
                <Text style={styles.payButtonText}>
                    {isLoading ? 'Traitement...' : 'Payer'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2980b9',
        marginBottom: 20,
    },
    userName: {
        fontSize: 20,
        color: '#2c3e50',
        marginBottom: 10,
    },
    orderItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemName: {
        fontSize: 18,
        color: '#2c3e50',
    },
    itemPrice: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginTop: 20,
        marginBottom: 20,
    },
    payButton: {
        backgroundColor: '#27ae60',
        padding: 15,
        borderRadius: 50,
        width: '50%',
        alignItems: 'center',
    },
    payButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default FactureScreen;
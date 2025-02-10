import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assurez-vous d'avoir expo install pour les icônes

const WelcomeScreen = ({ route, navigation }) => {
    const { userName, email } = route.params;

    // Liste de plats disponibles avec ingrédients
    const menuItems = [
        { id: 1, name: 'Pizza', price: 12.000, ingredients: ['Tomate', 'Fromage', 'Pain', 'Charcuterie', 'Oignon'] },
        { id: 2, name: 'Spaghetti', price: 10.000, ingredients: ['Tomate', 'Pate', 'Fromage', 'Porc'] },
        { id: 3, name: 'Soupe Porc', price: 8.000, ingredients: ['Pate', 'Bouillon', 'Porc', 'Oeuf'] },
        { id: 4, name: 'Cote sauce', price: 14.000, ingredients: ['Oignon', 'Porc', 'Riz'] },
        { id: 5, name: 'Sandwich', price: 6.000, ingredients: ['Oignon', 'Oeuf', 'Pain', 'Tomate', 'Fromage'] },
        { id: 6, name: 'Lasopy atody', price: 8.000, ingredients: ['Oeuf', 'Bouillon', 'Pate'] },
        { id: 7, name: 'Rie aux oeufs', price: 10.000, ingredients: ['Oeuf', 'Riz', 'Oignon', 'Tomate'] },




    ];

    // Liste des commandes de l'utilisateur
    const [orders, setOrders] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    // Fonction pour ajouter ou ajuster la quantité d'un plat
    const handleAdjustQuantity = (item, operation) => {
        const existingOrderIndex = orders.findIndex(order => order.id === item.id);

        if (existingOrderIndex !== -1) {
            const updatedOrders = [...orders];
            const updatedOrder = updatedOrders[existingOrderIndex];
            const newQuantity = operation === 'add' ? updatedOrder.quantity + 1 : updatedOrder.quantity - 1;

            if (newQuantity > 0) {
                updatedOrder.quantity = newQuantity;
                setOrders(updatedOrders);
            } else {
                updatedOrders.splice(existingOrderIndex, 1);
                setOrders(updatedOrders);
            }
        } else {
            if (operation === 'add') {
                setOrders([...orders, { ...item, quantity: 1 }]);
            }
        }
    };

    // Calcul du prix total
    const totalPrice = orders.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
            <Text style={styles.email}>Email: {email}</Text>

            <Text style={styles.title}>Menu</Text>

            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price}</Text>

                        <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                        <Text style={styles.ingredientsText}>{item.ingredients.join(', ')}</Text>

                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAdjustQuantity(item, 'subtract')}
                            >
                                <MaterialIcons name="remove" size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>
                                {orders.find(order => order.id === item.id)?.quantity || 0}
                            </Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAdjustQuantity(item, 'add')}
                            >
                                <MaterialIcons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {orders.find(order => order.id === item.id) && (
                            <Text style={styles.addedText}>Added to order</Text>
                        )}
                    </View>
                )}
            />

            {/* Sidebar pour les commandes */}
            {isSidebarVisible && (
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Your Orders</Text>
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
                </View>
            )}

            {/* Flèche pour ouvrir/fermer la sidebar */}
            <TouchableOpacity
                style={[styles.arrowButton, isSidebarVisible ? styles.arrowButtonOpen : null]}
                onPress={() => setIsSidebarVisible(!isSidebarVisible)}
            >
                <MaterialIcons name={isSidebarVisible ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.invoiceButton} onPress={() => navigation.navigate('Facture', { userName, totalPrice, orders })}>
                <Text style={styles.invoiceButtonText}>Go to Invoices</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '00000',
    },
    welcomeText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        color: '#7f8c8d',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2980b9',
        marginVertical: 15,
    },
    menuItem: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        width: '90%',
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    itemName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 18,
        color: 'green',
        marginBottom: 10,
    },
    ingredientsTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#8e44ad',
        marginBottom: 5,
    },
    ingredientsText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    quantityButton: {
        backgroundColor: '#2980b9',
        padding: 10,
        borderRadius: 30,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 20,
        fontWeight: '600',
    },
    addedText: {
        fontSize: 14,
        color: '#2ecc71',
        marginTop: 5,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: 20,
        zIndex: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    sidebarTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2980b9',
        marginBottom: 10,
    },
    orderItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#27ae60',
        marginTop: 20,
        marginBottom: 20,
    },
    arrowButton: {
        position: 'absolute',
        top: '40%',
        right: 10,
        backgroundColor: '#2980b9',
        padding: 10,
        borderRadius: 50,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowButtonOpen: {
        transform: [{ rotate: '180deg' }],
    },
    invoiceButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 30,
        marginTop: 20,
    },
    invoiceButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default WelcomeScreen;

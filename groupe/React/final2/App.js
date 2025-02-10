import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import WelcomeScreen from './WelcomeScreen';
import FactureScreen from './FactureScreen';
import SignUpScreen from './SignUpScreen';

// Import des fonctions Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Pour Firestore
import { getFunctions } from "firebase/functions"; // Pour Firebase Functions
import { getAnalytics } from "firebase/analytics";
// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBBuJCFOwpUuKP-vIsWkIuUHGGC85gu0X4",
    authDomain: "final2-411d3.firebaseapp.com",
    projectId: "final2-411d3",
    storageBucket: "final2-411d3.firebasestorage.app",
    messagingSenderId: "608842105617",
    appId: "1:608842105617:web:768eb7e77ab3d3721182b0",
    measurementId: "G-735NR78M1K"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialisation des services Firebase
const db = getFirestore(app); // Firestore
const functions = getFunctions(app); // Firebase Functions

// Création du Stack Navigator
const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Facture" component={FactureScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
  // Fonction pour ajouter une commande
  const addCommande = async () => {
    try {
      await addDoc(collection(db, "commandes"), {
        client: "John Doe",
        plat: "Pizza",
        prix: 12.99,
        date: new Date(),
      });
      console.log("Commande ajoutée !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  // Fonction pour récupérer les commandes
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "commandes"));
      setData(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>Liste des Commandes :</Text>
      {data.map((commande, index) => (
        <Text key={index}>{commande.client} - {commande.plat} - {commande.prix}€</Text>
      ))}
      <Button title="Ajouter une commande" onPress={addCommande} />
    </View>
  );

export default App;

// Export des services Firebase pour les utiliser dans d'autres composants
export { db, functions };
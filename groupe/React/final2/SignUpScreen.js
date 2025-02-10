import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        if (!userName || !email || !password) {
            alert('Please fill all fields to sign up');
        }
        else {
            navigation.navigate('Welcome to our game', { userName });
        }
    };
    return (
        <View style={style.container}>
            <Text style={StyleSheet.title}>Sign up</Text>
            <TextInput
                style={StyleSheet.input}
                placeholder="Enter your name"
                value={userName}
                onChange={setUserName}
            />

            <TextInput
                style={StyleSheet.input}
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={style.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Sign up" onPress={handleSignUp} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default SignUpScreen;

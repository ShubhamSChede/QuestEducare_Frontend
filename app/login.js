import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('https://questeducare.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Add this
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      Alert.alert('Login Successful', `Welcome, ${data.user.name}`);
      // Navigate to MainPage
      navigation.navigate('Mainpage');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-blue-600 mb-6">Login</Text>

      <TextInput
        className="w-full bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-300"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full bg-white p-3 rounded-lg shadow-sm mb-6 border border-gray-300"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="w-full bg-blue-500 p-3 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-center text-white font-medium">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

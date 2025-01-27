import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://questeducare.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Ensures cookies are included
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token
      try {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      } catch (storageError) {
        console.error('Error storing token:', storageError);
      }

      Alert.alert('Login Successful', `Welcome, ${data.user.name}`);
      // Navigate to MainPage
      router.push('Mainpage');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
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
        autoComplete="email"
        placeholderTextColor="#9ca3af"
      />

      <View className="w-full relative mb-6">
        <TextInput
          className="w-full bg-white p-3 rounded-lg shadow-sm border border-gray-300 pr-12"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3"
        >
          <Ionicons 
            name={showPassword ? "eye-off" : "eye"} 
            size={24} 
            color="#6b7280" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`w-full bg-blue-600 p-3 rounded-lg ${loading ? 'opacity-50' : ''}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-center text-white font-medium">Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('Mainpage')}
        className="mt-4"
      >
        <Text className="text-center text-blue-600 underline">Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Navbar from './components/Navbar'; // Adjust the path based on your folder structure
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainPage = () => {
    const [studentDetails, setStudentDetails] = useState(null); // State for student data
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error

    useEffect(() => {
        // Fetch student details on component mount
        const fetchStudentDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch("https://questeducare.onrender.com/api/student/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setStudentDetails(data.profile); // Extract profile data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchStudentDetails();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="text-lg text-gray-800">Loading student details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-lg text-red-500">Error: {error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 flex-row">
            {/* Navbar Component */}
            <Navbar />

            {/* Main Content */}
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-xl text-gray-800">Welcome, {studentDetails.name}!</Text>
                <Text className="text-lg text-gray-700">Email: {studentDetails.email}</Text>
                <Text className="text-lg text-gray-700">Role: {studentDetails.role}</Text>
                <Text className="text-lg text-gray-700">Class: {studentDetails.class}</Text>
            </View>
        </View>
    );
};

export default MainPage;

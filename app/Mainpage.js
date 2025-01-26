import React from 'react';
import { View, Text } from 'react-native';
import Navbar from './components/Navbar'; // Adjust the path based on your folder structure

const MainPage = () => {
  return (
    <View className="flex-1 flex-row">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-gray-800">select a subject from the menu</Text>
      </View>
    </View>
  );
};

export default MainPage;

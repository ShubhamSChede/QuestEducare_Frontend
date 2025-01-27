import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import Navbar from './components/Navbar';

const PhyClass11 = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();

  const examTypes = [
    { id: 1, name: 'Boards', route: 'boards_phy_11' },
    { id: 2, name: 'JEE', route: 'jee_phy_11' },
    { id: 3, name: 'NEET', route: 'neet_phy_11' }
  ];

  const handleNavigation = (route) => {
    router.push(route);
    setDropdownVisible(false);
  };

  return (
    <View className="flex-1 flex-row">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <View className="flex-1 p-4">
        {/* Header Section */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">Physics - Class 11</Text>

        {/* Dropdown Button */}
        <View>
          <TouchableOpacity
            onPress={() => setDropdownVisible(true)}
            className="bg-blue-950 p-4 rounded-lg items-center "
          >
            <Text className="text-white font-semibold text-lg mb-2">Select Exam Type ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Modal */}
        <Modal
          transparent={true}
          visible={isDropdownVisible}
          onRequestClose={() => setDropdownVisible(false)}
          animationType="fade"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={() => setDropdownVisible(false)}
          >
            <View className="bg-white rounded-lg w-4/5 overflow-hidden">
              {examTypes.map((exam) => (
                <TouchableOpacity
                  key={exam.id}
                  onPress={() => handleNavigation(exam.route)}
                  className="p-4 border-b border-gray-200"
                >
                  <Text className="text-lg text-gray-800">{exam.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
};

export default PhyClass11;

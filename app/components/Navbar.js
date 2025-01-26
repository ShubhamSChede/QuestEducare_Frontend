import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // Import required icons
import { router } from 'expo-router';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [navWidth] = useState(new Animated.Value(60)); // Initial width 60

  const toggleNav = () => {
    const toValue = isExpanded ? 60 : 250; // Collapsed: 60, Expanded: 250

    Animated.spring(navWidth, {
      toValue: toValue,
      useNativeDriver: false,
      bounciness: 8,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const subjects = [
    { name: 'Maths', icon: <AntDesign name="calculator" size={24} color="white" /> },
    { name: 'Physics', icon: <MaterialCommunityIcons name="atom" size={24} color="white" /> },
    { name: 'Chemistry', icon: <SimpleLineIcons name="chemistry" size={24} color="white" /> },
    { name: 'Biology', icon: <MaterialCommunityIcons name="dna" size={24} color="white" /> },
  ];

  return (
    <Animated.View style={{ width: navWidth }} className="bg-gray-800 h-full">
      <TouchableOpacity
        onPress={toggleNav}
        className="p-4 border-b border-gray-700"
      >
        <Ionicons
          name={isExpanded ? "menu" : "menu-outline"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <View className="mt-4">
        {subjects.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="px-4 py-3 flex-row items-center"
            onPress={() => router.push(item.name)}
          >
            {item.icon} 
            {isExpanded && (
              <Text className="text-white ml-3">{item.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default Navbar;

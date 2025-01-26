import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import Navbar from './components/Navbar';
import { router } from 'expo-router';
const Tab = createMaterialTopTabNavigator();

const Grade11 = ({ router }) => (
  <View className="flex-1 justify-center items-center bg-gray-100">
    <Text
      onPress={() => router.push('/phyclass11')}
      className="text-lg text-gray-800"
    >
      Physics Content for 11th Grade
    </Text>
  </View>
);

const Grade12 = ({ router }) => (
  <View className="flex-1 justify-center items-center bg-gray-100">
    <Text
      onPress={() => router.push('/phyclass12')}
      className="text-lg text-gray-800"
    >
      Physics Content for 12th Grade
    </Text>
  </View>
);

const Physics = () => {

  return (
    <View className="flex-1 flex-row">
      <Navbar />
      <View className="flex-1">
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: '#4A5568' },
            tabBarIndicatorStyle: { backgroundColor: 'white' },
            tabBarLabelStyle: { color: 'white' },
          }}
        >
          <Tab.Screen name="11th Grade">
            {() => <Grade11 router={router} />}
          </Tab.Screen>
          <Tab.Screen name="12th Grade">
            {() => <Grade12 router={router} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  );
};

export default Physics;

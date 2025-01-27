import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';


const Index = () => {
  return (
    <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-5xl font-bold text-red-200 mb-2">QUEST EDUCARE</Text>
        <Text className="text-2xl font-bold text-white">Welcome to Quest EduCare</Text>
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-lg mt-4"
          onPress={() => router.push('login')} 
          >
          <Text className="text-white font-bold">Get Started</Text>
          </TouchableOpacity>
    </View>
  )
}

export default Index




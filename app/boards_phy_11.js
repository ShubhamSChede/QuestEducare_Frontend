import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  RefreshControl
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResizeMode, Video } from "expo-av";
import Navbar from "./components/Navbar";

const BoardsPhysics11 = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert(
          "Authentication Error", 
          "Please log in again to access your content.",
          [{ text: "OK", onPress: () => {/* Handle navigation to login */} }]
        );
        setLoading(false);
        return;
      }

      const response = await fetch("https://questeducare.onrender.com/api/student/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch videos");
      }

      const data = await response.json();
      const filteredVideos = data.filter(video => 
        video.category.includes("Boards") &&
        video.subject === "Physics" &&
        video.class === "11"
      );

      setVideos(filteredVideos);
      setShowRequestButton(filteredVideos.length === 0);
    } catch (error) {
      console.error("Error fetching videos:", error);
      Alert.alert(
        "Error",
        "Unable to load videos. Please check your connection and try again.",
        [{ text: "Retry", onPress: () => fetchVideos() }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos();
  }, []);

  const handleRequestAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Authentication Error", "Please log in again to request access.");
        return;
      }

      const response = await fetch("https://questeducare.onrender.com/api/student/access/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: "Physics",
          categories: "Boards",
        }),
      });

      if (response.ok) {
        Alert.alert(
          "Request Submitted",
          "Your access request has been submitted successfully. We'll notify you once it's approved.",
          [{ text: "OK" }]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit access request");
      }
    } catch (error) {
      console.error("Error requesting access:", error);
      Alert.alert(
        "Request Failed",
        "Unable to submit your request. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const VideoPlayer = ({ videoUrl }) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
      <Video
        ref={video}
        style={{ width: "100%", height: 200 }}
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
    );
  };

  const renderVideo = ({ item }) => (
    <View 
      style={{ 
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
    >
      <TouchableOpacity 
        onPress={() => setSelectedVideo(selectedVideo?._id === item._id ? null : item)}
        style={{ marginBottom: selectedVideo?._id === item._id ? 16 : 0 }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{item.title}</Text>
        <Text style={{ color: '#666666', marginBottom: 8 }}>{item.description}</Text>
        <Text style={{ color: '#3b82f6', marginBottom: 8 }}>Chapter: {item.chapter}</Text>
        <Text style={{ color: '#666666', fontSize: 14, marginBottom: 8 }}>
          Subject: {item.subject} • Class: {item.class}
        </Text>
      </TouchableOpacity>
      
      {selectedVideo?._id === item._id && (
        <View>
          <VideoPlayer videoUrl={item.cloudinaryUrl} />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, color: '#666666' }}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-row">
            {/* Navbar Component */}
            <Navbar />
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item._id}
          renderItem={renderVideo}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      ) : showRequestButton ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 18, color: '#666666', marginBottom: 16, textAlign: 'center' }}>
            No videos are currently available for this category.
          </Text>
          <Button 
            title="Request Access" 
            onPress={handleRequestAccess}
            color="#3b82f6"
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 18, color: '#666666', textAlign: 'center' }}>
            No videos found for Physics Class 11 Boards category.
          </Text>
        </View>
      )}
    </View>
  );
};

export default BoardsPhysics11;
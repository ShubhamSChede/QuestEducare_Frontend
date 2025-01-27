import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

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
    async function unlockOrientation() {
      await ScreenOrientation.unlockAsync();
    }
    unlockOrientation();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVideos();
  }, []);

  const VideoPlayer = ({ videoUrl }) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const speeds = [0.5, 1.0, 1.5, 2.0];

    useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        setDimensions(window);
      });

      return () => subscription?.remove();
    }, []);

    const formatTime = (timeInMillis) => {
      const totalSeconds = Math.floor(timeInMillis / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const onPlaybackStatusUpdate = (status) => {
      setStatus(status);
      setIsPlaying(status.isPlaying || false);
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
        setPosition(status.positionMillis || 0);
      }
    };

    const handleSliderChange = async (value) => {
      if (video.current) {
        await video.current.setPositionAsync(value);
      }
    };

    const toggleControls = () => {
      setShowControls(!showControls);
      if (showControls) {
        setTimeout(() => setShowControls(false), 3000);
      }
    };

    const changePlaybackSpeed = async () => {
      if (!video.current) return;
      const currentIndex = speeds.indexOf(playbackSpeed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      const newSpeed = speeds[nextIndex];
      await video.current.setRateAsync(newSpeed, true);
      setPlaybackSpeed(newSpeed);
    };

    const togglePlayPause = async () => {
      if (!video.current) return;
      if (isPlaying) {
        await video.current.pauseAsync();
      } else {
        await video.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    };

    const toggleFullscreen = async () => {
      if (!isFullscreen) {
        setIsFullscreen(true);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
      } else {
        setIsFullscreen(false);
        await ScreenOrientation.unlockAsync();
      }
    };

    const VideoControls = () => (
      <View style={[
        styles.controlsContainer,
        { opacity: showControls ? 1 : 0 }
      ]}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            onPress={toggleFullscreen}
            style={styles.controlButton}
          >
            <Ionicons 
              name={isFullscreen ? "contract-outline" : "expand-outline"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={changePlaybackSpeed}
            style={styles.speedButton}
          >
            <Ionicons name="speedometer-outline" size={24} color="white" />
            <Text style={styles.speedText}>{playbackSpeed}x</Text>
          </TouchableOpacity>
        </View>

        {/* Center play/pause button */}
        <TouchableOpacity 
          onPress={togglePlayPause}
          style={styles.playPauseButton}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={36} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Bottom controls with slider */}
        <View style={styles.bottomControls}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#888888"
            thumbTintColor="#FFFFFF"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    );

    return (
      <View style={[
        styles.videoContainer,
        isFullscreen && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: 'black',
          zIndex: 999
        }
      ]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleControls}
          style={{ flex: 1 }}
        >
          <Video
            ref={video}
            style={{
              width: '100%',
              height: '100%',
            }}
            source={{ uri: videoUrl }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
          <VideoControls />
        </TouchableOpacity>
      </View>
    );
  };

  const renderVideo = ({ item }) => (
    <View style={styles.videoCard}>
      <TouchableOpacity 
        onPress={() => setSelectedVideo(selectedVideo?._id === item._id ? null : item)}
        style={{ marginBottom: selectedVideo?._id === item._id ? 16 : 0 }}
      >
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDescription}>{item.description}</Text>
        <Text style={styles.chapterText}>Chapter: {item.chapter}</Text>
        <Text style={styles.metaText}>
          Subject: {item.subject} • Class: {item.class}
        </Text>
      </TouchableOpacity>
      
      {selectedVideo?._id === item._id && (
        <VideoPlayer videoUrl={item.cloudinaryUrl} />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item._id}
          renderItem={renderVideo}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : showRequestButton ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No videos are currently available for this category.
          </Text>
          <Button 
            title="Request Access" 
            onPress={() => {/* Handle request access */}}
            color="#3b82f6"
          />
        </View>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No videos found for Physics Class 11 Boards category.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    color: '#666666',
  },
  listContainer: {
    padding: 16,
  },
  separator: {
    height: 8,
  },
  videoCard: {
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
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#666666',
    marginBottom: 8,
  },
  chapterText: {
    color: '#3b82f6',
    marginBottom: 8,
  },
  metaText: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  videoContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
    backgroundColor: 'black',
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  speedText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  playPauseButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 50,
  },
  slider: {
    flex: 1,
    marginHorizontal: 16,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default BoardsPhysics11;
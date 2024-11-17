import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

import { ThemedText } from '@/components/ThemedText';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface PhotoSequenceProps {}

export default function PhotoSequence({}: PhotoSequenceProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (!permissionResponse?.granted) {
      await requestPermission();
    }
  };

  const selectPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        aspect: [16, 9],
      });

      if (!result.canceled) {
        const selectedAssets = result.assets.map((asset) => asset.uri);
        if (selectedAssets.length < 10 || selectedAssets.length > 12) {
          alert('Please select between 10 and 12 photos');
          return;
        }
        setSelectedPhotos(selectedAssets);
      }
    } catch (error) {
      console.error('Error selecting photos:', error);
      alert('Error selecting photos. Please try again.');
    }
  };

  const createVideoSequence = async () => {
    if (selectedPhotos.length < 10 || selectedPhotos.length > 12) {
      alert('Please select between 10 and 12 photos');
      return;
    }

    setIsProcessing(true);
    try {
      // Note: This is a placeholder for the actual video processing
      // In a real implementation, you would use a video processing library
      // such as FFmpeg or a cloud service to create the video
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('Video created successfully!');
      // Here you would normally save the video and share it
    } catch (error) {
      console.error('Error creating video:', error);
      alert('Error creating video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedText type="title">Create Photo Sequence</ThemedText>
      <ThemedText>Select upto 12 photos to create a video sequence.</ThemedText>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={selectPhotos}
        disabled={isProcessing}
      >
        <ThemedText style={styles.buttonText}>Select Photos</ThemedText>
      </TouchableOpacity>

      <ScrollView
        horizontal
        style={styles.previewContainer}
        contentContainerStyle={styles.previewContent}
      >
        {selectedPhotos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.previewImage}
          />
        ))}
      </ScrollView>

      {selectedPhotos.length > 0 && (
        <TouchableOpacity
          style={[styles.createButton, isProcessing && styles.disabledButton]}
          onPress={createVideoSequence}
          disabled={isProcessing}
        >
          <ThemedText style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Create Video'}
          </ThemedText>
        </TouchableOpacity>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    maxHeight: 120,
  },
  previewContent: {
    gap: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

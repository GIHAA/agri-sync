import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

interface Result {
  gender: string;
  age: string;
}

const App: React.FC = () => {
  
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string>('');

  // Handle image picking from the device
  const pickImage = async (): Promise<void> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed', 
          'Sorry, we need camera roll permissions to make this work!',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    try {
      // Launch image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
        allowsEditing: true, // Allow cropping
        aspect: [4, 3], // Aspect ratio of the crop
        quality: 1, // Highest quality
        base64: false // Don't convert to base64 to save memory
      });

      // Check if an image was selected
      if (!result.canceled && result.assets && result.assets.length > 0) {
        
        setImage(result.assets[0].uri);
        setError('');
      }
    } catch (err) {
      setError('Failed to pick an image. Please try again.');
      console.error(err);
    }
  };

  // Rest of the component remains the same as in your original code
  const analyzeImage = async (): Promise<void> => {
    if (!image) {
      setError('Please select an image.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append('image', blob, 'photo.jpg');

      const apiResponse = await axios.post('http://localhost:3001/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (apiResponse.data && apiResponse.data.data) {
        setResults(apiResponse.data.data);
      } else {
        setError('No faces detected or analysis failed.');
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-6">Age and Gender Detection</Text>
      
      {/* Image picker */}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-full mb-4"
        onPress={pickImage}
      >
        <Text className="text-white">Pick an Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} className="w-40 h-40 rounded-lg mb-4" />}

      {/* Rest of the component remains the same */}
      <TouchableOpacity
        className={`bg-green-500 p-3 rounded-full mb-4 ${loading ? 'bg-gray-400' : ''}`}
        onPress={analyzeImage}
        disabled={loading}
      >
        <Text className="text-white">{loading ? 'Analyzing...' : 'Analyze Image'}</Text>
      </TouchableOpacity>

      {loading && <Text className="text-lg">Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}

      {results.length > 0 && (
        <View className="mt-4">
          <Text className="text-xl font-semibold mb-2">Results:</Text>
          {results.map((result, index) => (
            <View key={index} className="mb-4">
              <Text className="font-bold">Gender: {result.gender}</Text>
              <Text className="font-bold">Age: {result.age}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default App;
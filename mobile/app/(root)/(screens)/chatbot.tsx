import {
  Pressable,
  TextInput,
  View,
  Animated,
  Keyboard,
  Easing,
  Platform,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { ip } from '../../../api/ip'

import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Chat() {
  const backendUrl = `${ip}:3007/query`; 

  const [chatText, setChatText] = useState("");
  const [textInputHeight, setTextInputHeight] = useState(60);
  const [sendingChat, setSendingChat] = useState(false);
  const [conversation, setConversation] = useState<
    { role: String; content: string }[]
  >([]);

  const translateYRef = useRef(new Animated.Value(0)).current;

  // Suggestion messages for empty state
  const suggestionMessages = [
    "How can I help you today?",
    "මේ දවස්වල වගා කිරීම සුදුසුයි ද ?",
    "What services do you offer?",
    "I need technical support"
  ];

  // Function to handle suggestion tap
  const handleSuggestionTap = (suggestion: SetStateAction<string>) => {
    setChatText(suggestion);
  };

  // Function to send chat query to backend
  const sendChatQuery = async () => {
    if (!chatText.trim()) return; // Prevent empty messages

    setSendingChat(true); // Set sending state to true while awaiting response

    try {
      // Send the request to the backend
      console.log("Backend URL:", backendUrl);

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: chatText }),
      });

      // Check if response is successful
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add the user's query and backend response to the conversation state
      setConversation((prevConversation) => [
        ...prevConversation,
        { role: "user", content: chatText },
        { role: "bot", content: data.result },
      ]);

      setChatText(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending chat query:", error);
      Alert.alert("Error", "There was a problem sending the message. Please try again.");
    } finally {
      setSendingChat(false); // Set sending state back to false
    }
  };

  // Background image for the chat
  const backgroundImage = require('../../../assets/images/agriculture-background.jpg');
  // Note: You'll need to add this image to your assets folder or use a URL with { uri: "https://your-image-url.jpg" }

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(255, 255, 255, 0.55)' // Semi-transparent white overlay
      }}>
        <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={{ flex: 1, justifyContent: "flex-end", padding: 16 }}>
            {conversation.length === 0 ? (
              // Empty state UI with chatbot icon and suggestions
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ 
                  backgroundColor: "#e7e5e4", 
                  borderRadius: 60, 
                  width: 120, 
                  height: 120, 
                  justifyContent: "center", 
                  alignItems: "center",
                  marginBottom: 30,
                  borderWidth: 3,
                  borderColor: "#22c55e"
                }}>
                  <FontAwesome5 name="seedling" size={60} color="#22c55e" />
                </View>
                
                <Text style={{ 
                  fontSize: 22, 
                  fontWeight: "bold", 
                  marginBottom: 20,
                  color: "#166534" // Dark green color for agriculture theme
                }}>
                  How can I assist you today?
                </Text>
                
                <View style={{ width: "100%" }}>
                  {suggestionMessages.map((suggestion, index) => (
                    <Pressable 
                      key={index}
                      onPress={() => handleSuggestionTap(suggestion)}
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.8)", 
                        padding: 15, 
                        borderRadius: 15, 
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: "#22c55e",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2
                      }}
                    >
                      <Text style={{ color: "#166534" }}>{suggestion}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : (
              // Conversation messages display
              <View style={{ flex: 1 }}>
                {conversation.map((message, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: 16,
                      justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* Bot avatar - only show for bot messages */}
                    {message.role === "bot" && (
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "#e7e5e4",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: "#22c55e",
                      }}>
                        <FontAwesome5 name="robot" size={20} color="#4b5563" />
                      </View>
                    )}
                    
                    <View
                      style={{
                        padding: 12,
                        backgroundColor: message.role === "user" ? "#22c55e" : "rgba(255, 255, 255, 0.9)",
                        borderRadius: 16,
                        maxWidth: "75%",
                        borderWidth: message.role === "bot" ? 1 : 0,
                        borderColor: "#22c55e",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 1
                      }}
                    >
                      <Text style={{ 
                        color: message.role === "user" ? "#fff" : "#166534",
                        fontSize: 15
                      }}>
                        {message.content}
                      </Text>
                    </View>
                    
                    {/* User avatar - only show for user messages */}
                    {message.role === "user" && (
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "#22c55e",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 8,
                        borderWidth: 1,
                        borderColor: "#fff",
                      }}>
                        <FontAwesome name="user" size={20} color="#fff" />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      
        {/* Fixed bottom input section */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: "#ccc",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5
          }}
        >
          <Pressable>
            <FontAwesome
              name={"microphone"}
              size={24}
              color={"#22c55e"}
              style={{ marginRight: 10 }}
            />
          </Pressable>
          
          <TextInput
            style={{
              flex: 1,
              height: textInputHeight,
              borderColor: "#22c55e",
              borderWidth: 1,
              borderRadius: 20,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: "#fff",
            }}
            value={chatText}
            onChangeText={setChatText}
            placeholder="Type your message..."
            multiline
          />
          <Pressable
            onPress={sendChatQuery}
            style={{
              backgroundColor: "#22c55e",
              padding: 10,
              marginLeft: 10,
              borderRadius: 10,
            }}
            disabled={sendingChat}
          >
            {sendingChat ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="send" size={24} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}
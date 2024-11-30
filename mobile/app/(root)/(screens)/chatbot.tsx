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
  } from "react-native";
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import { useEffect, useRef, useState } from "react";
  
  import { Feather } from "@expo/vector-icons";
  import FontAwesome from "@expo/vector-icons/FontAwesome";
  
  export default function Chat() {
    const backendUrl = "http://192.168.92.3:5000/query"; 

    const [chatText, setChatText] = useState("");
    const [textInputHeight, setTextInputHeight] = useState(60);
    const [sendingChat, setSendingChat] = useState(false);
    const [conversation, setConversation] = useState<
      { role: String; content: string }[]
    >([]);
  
    const translateYRef = useRef(new Animated.Value(0)).current;
  
    // Function to send chat query to backend
    const sendChatQuery = async () => {
      if (!chatText.trim()) return; // Prevent empty messages
  
      setSendingChat(true); // Set sending state to true while awaiting response
  
      try {
        // Send the request to the backend
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
  
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "flex-end", padding: 16 }}>
          <View style={{ flex: 1 }}>
            {/* Display the conversation */}
            {conversation.map((message, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <View
                  style={{
                    padding: 10,
                    backgroundColor: message.role === "user" ? "#22c55e" : "#e7e5e4",
                    borderRadius: 10,
                    maxWidth: "80%",
                  }}
                >
                  <Text>{message.content}</Text>
                </View>
              </View>
            ))}
          </View>
  
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderTopWidth: 1,
              borderTopColor: "#ccc",
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: textInputHeight,
                borderColor: "#ccc",
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
      </KeyboardAwareScrollView>
    );
  }
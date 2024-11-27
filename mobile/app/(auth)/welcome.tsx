import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import  { useState } from 'react';

import { trackInteraction, getUiRecommendation } from '../../api/reinforceUI';

const Welcome = () => {

  const [buttonClicks, setButtonClicks] = useState(0);
  const [uiAction, setUiAction] = useState<string | null>(null);

   // Function to simulate button clicks and track them
   const handleButtonClick = async () => {
    setButtonClicks(buttonClicks + 1);
    const response = await trackInteraction(buttonClicks + 1); // Send the number of clicks to the backend

    // Fetch the UI recommendation (action to adjust UI)
    const recommendation = await getUiRecommendation();
    setUiAction(recommendation.action); // Adjust UI based on the response
    console.log('UI recommendation:', recommendation.action);
    router.replace('/(auth)/sign-up');
  };


  const buttonStyles = uiAction === 'Move' ? styles.movedButton : styles.defaultButton;


  return (
    <SafeAreaView>
    <View className='flex flex-col justify-center items-center my-auto h-full'>

    {uiAction && <Text>Recommended Action: {uiAction}</Text>}

      <Text className=' text-[32px]'>welocme</Text>
      <TouchableOpacity
      onPress={handleButtonClick} style={buttonStyles}
      className='w-1/2 bg-[#2F855A] p-8 rounded-lg mt-4 self-center'>
      <Text className='text-center'>NEXT</Text>
      </TouchableOpacity>


      <TouchableOpacity
      onPress={() => {
        router.replace('/(root)/(screens)/home')
      }}
      className='w-1/2 bg-[#2F855A] p-8 rounded-lg mt-4 self-center'>
      <Text className='text-center'>Debug</Text>
      </TouchableOpacity>


    </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultButton: {
    width: 200,
    height: 50,
    backgroundColor: 'blue',
  },
  movedButton: {
    width: 200,
    height: 50,
    backgroundColor: 'green',
    marginLeft: 100, // Move the button to the right
  },
});
export default Welcome
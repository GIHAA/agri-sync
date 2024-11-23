import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Welcome = () => {
  return (
    <SafeAreaView>
    <View className='flex flex-col justify-center items-center my-auto h-full'>
      <Text className=' text-[32px]'>welocme</Text>
      <TouchableOpacity
      onPress={() => {
        router.replace('/(auth)/sign-up')
      }}
      className='w-1/2 bg-[#2F855A] p-8 rounded-lg mt-4 self-center'>
      <Text className='text-center'>NEXT</Text>
      </TouchableOpacity>


      <TouchableOpacity
      onPress={() => {
        router.replace('/(root)/screens/home')
      }}
      className='w-1/2 bg-[#2F855A] p-8 rounded-lg mt-4 self-center'>
      <Text className='text-center'>Debug</Text>
      </TouchableOpacity>


    </View>
    </SafeAreaView>

  )
}

export default Welcome
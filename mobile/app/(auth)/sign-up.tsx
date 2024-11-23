import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const SignUp = () => {
  return (
    <SafeAreaView>
    
      <ScrollView>
        <View className='felx justify-center items-center '>
          <View>
            <Image 
              source={require("../../assets/images/reg-header-img.png")}
              className=' w-screen h-[191px]'
            />
          </View>
        <Text className='text-[32px] text-center'>Register</Text>
        <Text className='text-[16px] text-center'>You can register here</Text>


        <TouchableOpacity
      onPress={() => {
        router.replace('/(auth)/sign-in')
      }}
      className='w-1/2 bg-[#2F855A] p-8 rounded-lg mt-4 self-center'>
      <Text className='text-center'>NEXT</Text>
      </TouchableOpacity>
        </View>
      </ScrollView>
    
    </SafeAreaView>

  )
}

export default SignUp
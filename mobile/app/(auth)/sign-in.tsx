import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const SignIn = () => {
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
        <Text className='text-[32px] text-center'>Log In</Text>
        <Text className='text-[16px] text-center'>You can login here</Text>


   
        </View>
      </ScrollView>
    
    </SafeAreaView>


  )
}

export default SignIn
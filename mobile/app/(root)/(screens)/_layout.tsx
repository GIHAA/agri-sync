import { Stack } from "expo-router";
 
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="user-preferences" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      <Stack.Screen name="rewards" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="pricePrediction" options={{ headerShown: false }} />
      <Stack.Screen name="selectCropForPrediction" options={{ headerShown: false }} />
    </Stack>
  );
};
 
export default Layout;
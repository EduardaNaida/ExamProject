import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import * as firebase from "firebase";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SettingsPage from './screens/SettingsPage';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    //<LoginScreen/>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="LoginScreen" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false}} name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen options={{ headerShown: false}} name="SettingsPage" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

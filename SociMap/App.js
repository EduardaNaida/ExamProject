import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app'
import LoginScreen from './assets/screens/LoginScreen';

import AllContactsScreen from './assets/screens/AllContactsScreen';

// Added this for navigation to other page, refine to have button OnClick or just remove 
import {NavigationContainer} from '@react-navigation/native';
import PersonScreen from './assets/screens/PersonScreen';
import {createStackNavigator} from '@react-navigation/stack';
// END 

const app = initializeApp({
  apiKey: "AIzaSyARq36sGLC1ltpfqVMeMjgx-v5nbm7Ev5w",
  authDomain: "socimap-2b18e.firebaseapp.com",
  projectId: "socimap-2b18e",
  storageBucket: "socimap-2b18e.appspot.com",
  messagingSenderId: "1038195680118",
  appId: "1:1038195680118:web:92051d9ccc3fee341d5057",
  measurementId: "G-DB1JX1T6L8"
})

export default function App() {
  // TODO: Used for navigation to other page at developing stage 
  const Stack = createStackNavigator();
  
  return (
    //<LoginScreen/>

    // TODO: Shows PersonScreen when starting the app, used when developing PersonScreen  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PersonScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PersonScreen" component={PersonScreen} />
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

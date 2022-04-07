import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
<<<<<<< HEAD
import { FirebaseError, initializeApp } from 'firebase/app'
//import * as firebase from "firebase";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './assets/screens/LoginScreen';

const app = initializeApp({
  apiKey: "AIzaSyARq36sGLC1ltpfqVMeMjgx-v5nbm7Ev5w",
  authDomain: "socimap-2b18e.firebaseapp.com",
  projectId: "socimap-2b18e",
  storageBucket: "socimap-2b18e.appspot.com",
  messagingSenderId: "1038195680118",
  appId: "1:1038195680118:web:92051d9ccc3fee341d5057",
  measurementId: "G-DB1JX1T6L8"
})
=======
import { useEffect, useState } from 'react';
import { AttemptSignIn } from './FirebaseInterface';
>>>>>>> 874cb1cb30d8bbbeac3494eb27675163250d75fe

// let application;

// if (firebase.apps.length === 0){
//   application = firebase.initializeApp(app)
// } else {
//   application = firebase.app()
// }

// const auth = firebase.auth()
// export {auth}; 
const Stack = createNativeStackNavigator();

export default function App() {
<<<<<<< HEAD

  return (
    //<LoginScreen/>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false}} name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
=======
  const [text, setText] = useState("nuthing")

  useEffect(()=>{
    AttemptSignIn("test@test.com", "123123")
      .then(result =>{
        console.log(result);
        setText(result.user.uid)
      }).catch(err=>console.log(err))
  },[])
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <StatusBar style="auto" />
    </View>
>>>>>>> 874cb1cb30d8bbbeac3494eb27675163250d75fe
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

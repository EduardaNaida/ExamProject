
<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, LogBox  } from 'react-native';
import PersonsView from './Pages/PersonsView';
import SplashView from './Pages/SplashView';
import { DelayedLoginCheck, SetAuthStateChangeCallback } from './FirebaseInterface';
import LoginView from './Pages/LoginView';
import MainView from './Pages/MainView';

LogBox.ignoreLogs(['Setting a timer']);
console.ignoredYellowBox = ['Setting a timer'];

//import * as firebase from "firebase";


// let application;

// if (firebase.apps.length === 0){
//   application = firebase.initializeApp(app)
// } else {
//   application = firebase.app()
// }

// const auth = firebase.auth()
// export {auth}; 

export default function App() {
  const [splashing, setSplashing] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(()=>{
    return SetAuthStateChangeCallback(user =>{
      setSplashing(false);

      setLogged(user != null);
    });
  },[]);

  if(splashing)
    return(<SplashView></SplashView>);



  return !logged ? 
    (<LoginView></LoginView>)
    :
    (<MainView></MainView>);


  return (
    <SafeAreaView style={{flex:1}}>
        <StatusBar StatusBarStyle='light-content' ></StatusBar>
        <PersonsView></PersonsView>
    </SafeAreaView>
    );
=======
import EditPersonScreen from './assets/screens/EditPersonScreen';

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
    <LoginScreen/>

    // TODO: Shows PersonScreen when starting the app, used when developing PersonScreen  
    //<NavigationContainer>
    //  <Stack.Navigator initialRouteName="EditPersonScreen">
    //    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    //    <Stack.Screen name="EditPersonScreen" component={EditPersonScreen} />
    //  </Stack.Navigator>
    //</NavigationContainer>
  );
>>>>>>> origin/personPage
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

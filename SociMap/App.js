
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
<<<<<<< HEAD

=======
>>>>>>> main
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});


import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar  } from 'react-native';
import PersonsView from './Pages/PersonsView';


// let application;

// if (firebase.apps.length === 0){
//   application = firebase.initializeApp(app)
// } else {
//   application = firebase.app()
// }

// const auth = firebase.auth()
// export {auth}; 

export default function App() {
  return (
    <SafeAreaView style={{flex:1}}>
        <StatusBar StatusBarStyle='dark-content' ></StatusBar>
        <PersonsView></PersonsView>
    </SafeAreaView>
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

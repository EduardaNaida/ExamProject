import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app'

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
  
  return (
    <View style={styles.container}>
      <Text>Socimap away!</Text>
      <StatusBar style="auto" />
    </View>
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

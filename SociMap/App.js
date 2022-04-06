import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { AttemptSignIn } from './FirebaseInterface';

export default function App() {
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

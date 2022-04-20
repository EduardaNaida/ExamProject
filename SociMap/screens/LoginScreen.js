import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from 'react-native-feather';
import { AttemptSignIn, AttemptSignUp, GetCurrentUser } from "../FirebaseInterface"

function LoginScreen({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = React.useState({
        secureTextEntry: true

    });

    const handleSignUp = async () =>{
      
      console.log(GetCurrentUser());
      console.log('signing up!');
       // Password should be at least 6 characters
      if (password.length < 6){
        alert('Password should be at least 6 characters\n');
      }
      else {
        try{
          const signUp = await AttemptSignUp(email, password);
          console.log('signed up');
        }
        catch(err){
          if ( err.code === 'auth/email-already-in-use' ) {
            alert('Email already in use. Please try again');
          }
        }
      }
    }

    const handleSignIn = async () =>{

      try {
        const signIn = await AttemptSignIn(email, password);
        setLogged(true);
      }
      catch(err){
        if ( err.code === 'auth/wrong-password' ) {
            alert('Wrong password. Please try again');
          }
        else if( err.code === 'auth/missing-email'||  err.code === 'auth/missing-password' ) {
          alert('Please enter your email or password');
        }
        
      }

    }

    const updateSecureText = () => {
        setData({
            ... data,
            secureTextEntry: !data.secureTextEntry
        })
    }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>SOCIMAP</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          value={email}
          onChangeText={(text) => setEmail(text)}
          
      />
      </View>
      <View style={styles.inputView} >
        <TextInput
            style={styles.TextInput}
            placeholder="Password"
            value={password}
            secureTextEntry={data.secureTextEntry ? true : false}
            autoCapitalize='none'
            onChangeText={(text) => setPassword(text)}
        />
            <TouchableOpacity 
            onPress={updateSecureText}
            >
             <Feather 
             name = "eye-off"
             color = 'grey'
             size = {20}
             height= {30}
             marginLeft = {300}
             marginTop={-35}
             />
        </TouchableOpacity>


      </View>
     <View style={styles.btnContainer}>
      <TouchableOpacity 
        onPress={handleSignUp}
        style={styles.userBtn}>
        <Text style={styles.btnTxt}>SignUp</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleSignIn}
        style={styles.userBtn}>
        <Text style={styles.btnTxt}>Login</Text>
      </TouchableOpacity> 

      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ResetPasswordScreen')}>
        <View>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
        
        </View>
      </TouchableOpacity>

      <View style={styles.btnContainer}>
        <TouchableOpacity 
            onPress={() => navigation.navigate('SettingsPage')}
            style={styles.userBtn}>
          <Text style={styles.btnTxt}>Settings</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />  
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcome: {
      height: 150,
      fontSize: 30,
      textAlign: 'center',
      margin: 10,
      color: '#FF38E2',
      fontFamily: "Cochin"
    },
    inputView: {
      borderRadius: 25,
      width: "90%",
      backgroundColor: "#C4C4C480",
      padding: 15,
      height: 45,
      marginBottom: 10
    },
    TextInput: {
      borderColor: 'black',
      height: 40,
      //flex: 1,
      padding: 10,
      marginLeft: 10,
      marginTop: -12,
    },
    btnContainer:{
      flexDirection: 'row',
      justifyContent: "space-between",
      width: "75%",
    },
    userBtn:{
      borderRadius: 25,
      backgroundColor: "#FF38E2",
      padding: 15,
      width: "45%"
    },
    btnTxt:{
      fontSize: 16,
      textAlign: "center",
    },
    forgot_button: {
      height: 30,
      marginBottom: 30,
    }
  });
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Feather } from 'react-native-feather';
import { AttemptSignIn, AttemptSignUp, GetCurrentUser } from "../FirebaseInterface"

const background = require('../img/background.png');

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
      
      // input validation

      try{
        const signIn = await AttemptSignIn(email, password);
        setLogged(true);
      }
      catch(err){
        if ( err.code === 'auth/wrong-password' ) {
            alert('Wrong password. Please try again');
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
    <ImageBackground source={background} style={{width: '100%', height: '100%'}}>
    <View style={styles.firstContainer}>
      <Text style={styles.welcome}>SociMap</Text>
      </View>
      <Text style={styles.smallText}>Email</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder=""
          value={email}
          onChangeText={(text) => setEmail(text)}
          
      />
      </View>
      <Text style={styles.smallText}>Password</Text>
      <View style={styles.inputView} >
        <TextInput
            style={styles.TextInput}
            placeholder=""
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
        <Text style={styles.btnTxt}>Sign Up</Text>
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
     
       <StatusBar style="auto" /> 
    </ImageBackground> 
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
  },
    firstContainer: {
      alignItems: 'center',
      height: '40%'

    },
    secondContainer: {
      flex: 1,
    },

    welcome: {
      fontSize: 64,
      textAlign: 'center',
      color: 'white',
      //fontFamily: "Inter",
      marginTop: 60

    },
    smallText: {
      color: 'white',
      fontSize: 22,
      marginLeft: 80
    },
    inputView: {
      borderRadius: 25,
      width: "60%",
      backgroundColor: "white",
      opacity: 0.7,
      padding: 15,
      height: 33,
      alignSelf: 'center',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginBottom: 10
    },
    TextInput: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      textAlign: 'left',
      borderColor: 'black',
      height: 40,
      marginTop: -17,
      width:'100%',
    },
    btnContainer:{
      flexDirection: 'row',
      justifyContent: "center",
      width: "75%",
      alignSelf: 'center',
      opacity: 0.8,
    },
    userBtn:{
      borderRadius: 20,
      backgroundColor: "#FF38E2",
      padding: 10,
      width: "35%",
      margin: 15
    },
    btnTxt:{
      fontSize: 16,
      textAlign: "center",
      color: 'white',
      opacity: 1,
    },
    forgot_button: {
      height: 30,
      margin: 20,
      color: 'white',
      alignSelf: 'center',

    }
  });
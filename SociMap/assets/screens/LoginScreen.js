import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Feather} from 'react-native-feather';

function LoginScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInput: false,
        secureTextEntry: true

    });

    const handlePasswordChange = (val) =>{
        setData({
            ... data,
            password: val
        });
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
          onChangeText={(email) => setEmail(email)}
          
      />
      </View>
      <View style={styles.inputView} >
        <TextInput
            style={styles.TextInput}
            placeholder="Password"
            secureTextEntry={data.secureTextEntry ? true : false}
          //autoCapitalize='none'
        //onChangeText={(password) => setPassword(password)}
            onChangeText={(val) => handlePasswordChange(val)}
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
      <TouchableOpacity style={styles.userBtn}>
        <Text style={styles.btnTxt}>SignUp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.userBtn}>
        <Text style={styles.btnTxt}>Login</Text>
      </TouchableOpacity> 

      </View>

      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
     
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
import React, { useState} from 'react';
import {SendPasswordResetEmail} from "../FirebaseInterface"
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ImageBackground } from 'react-native';


const background = require('../img/background.png');

function ResetPasswordScreen({navigation}) {
    const [email, setEmail] = useState('');

    const resetPassword = async () =>{        // auth/missing-email
         const reset = await SendPasswordResetEmail(email);
         alert(`Please check ${email} to proceed with password reset.`,
        );
         navigation.navigate('LoginScreen');
      }
      

    return (
             
        <View>
           <View >
             <Text style={styles.txtWelcome}>Reset password</Text>
            </View>
          <Text style={styles.text}>
            Email address:
          </Text>
            <View style={styles.inputView} >
               <TextInput
                 placeholder="Your account email"
                 value={email}
                 onChangeText={(text) => setEmail(text)}
                 //autoCapitalize='none'
                 ></TextInput>
            </View> 
            
            <TouchableOpacity 
                onPress={() => resetPassword()
                }
                style={styles.userBtn}>
                <Text style={styles.btnTxt}>Submit</Text>
            </TouchableOpacity> 
        </View>
    );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      //alignItems: 'center',
      //justifyContent: 'center',
    },
    txtWelcome:{
      fontSize: 35,
      textAlign: 'center',
      marginTop: 115,
      color: 'white',
    },
    inputView: {
        borderRadius: 25,
        width: 300,
        backgroundColor: "#C4C4C480",
        padding: 5,
        paddingHorizontal:10,
        marginBottom: 10,
        alignSelf:'center',
      },
      TextInput: {
        borderColor: 'black'
      },
      btnTxt:{
        fontSize: 16,
        textAlign: "center",
        color:'white'
      },
      userBtn:{
        borderRadius: 25,
        marginLeft: 110,
        backgroundColor: "#FF38E2",
        padding: 15,
        width: "45%"
      },
      text:{
        color: 'white',
        fontSize: 16,
        marginTop: 140,
        width:300,
        alignSelf:'center'
    },
});


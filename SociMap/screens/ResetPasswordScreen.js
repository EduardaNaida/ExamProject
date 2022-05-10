import React, { useState} from 'react';
import {SendPasswordResetEmail} from "../FirebaseInterface"
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

function ResetPasswordScreen({navigation}) {
    const [email, setEmail] = useState('');

    const resetPassword = async () =>{        // auth/missing-email
         const reset = await SendPasswordResetEmail(email);
         alert(`Please check ${email} to proceed with password reset.`,
        );
         navigation.navigate('LoginScreen');
      }
      

    return (
             
        <View style={styles.container}>
            <View style={styles.inputView} >
        <TextInput
            style={styles.TextInput}
            placeholder="Your account email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize='none'
        />
         
             </View> 
            <TouchableOpacity 
                onPress={() => resetPassword()
                }
                style={styles.userBtn}>
            <Text style={styles.btnTxt}>Reset password</Text>
            </TouchableOpacity> 
        </View>
    );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
      btnTxt:{
        fontSize: 16,
        textAlign: "center",
      },
      userBtn:{
        borderRadius: 25,
        backgroundColor: "#FF38E2",
        padding: 15,
        width: "45%"
      }
});


import React from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GetCurrentUser, SignOut } from '../FirebaseInterface';

function SettingsPage(props) {

    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
            const signOut = await SignOut();
            const currentUser = GetCurrentUser();
             if (currentUser === null) {
                 Alert.alert('Success!', 'No user is logged in anymore!');
            }
        }
        catch(err){
            alert('Error log out');
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Settings</Text>
            
         <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => handleSignOut()}
                style={styles.userBtn}>
                 <Text style={styles.btnTxt}>Log out</Text>
            </TouchableOpacity>
         </View>
        </View>

                  );
}

export default SettingsPage;


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

})
import React, { useState } from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, Button, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GetCurrentUser, SignOut } from '../FirebaseInterface';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewPasswordScreen from './NewPasswordScreen';

function SettingsPageAux({navigation}) {

    const [email, _] = useState(() =>{
      return GetCurrentUser().email;
    }); 

    const handleSignOut = async () => {
        try {
            const signOut = await SignOut();
            const currentUser = GetCurrentUser();
             if (currentUser === null) {
                 Alert.alert('Success!', 'No user is logged in anymore!');
            }
        }
        catch(err){
           
        }
    }
    return (
      <View style={{flex:1}}>
          <Text style={{color:'white', fontSize:40, height:100, alignSelf:'center', textAlign:'center', textAlignVertical:'center'}}>Groups</Text>
          <View style={{flex:1, alignSelf:'stretch', backgroundColor:'white', borderTopLeftRadius:60, borderTopRightRadius:60}}>
                   <View style={styles.headerInfo}>
                     <Text style={styles.headerInfoTxt}>{email}</Text>
                   </View>

                   <View style={styles.menuInfo}>
                   <Pressable style={styles.userBtn}>
                     <Text style={styles.infoBtn}>Account</Text>
                   </Pressable>

                   <Pressable style={styles.userBtn}>
                      <Text style={styles.infoBtn}>Language</Text>
                   </Pressable>

                   <Pressable style={styles.userBtn} onPress={() => navigation.navigate('NewPasswordScreen')}>
                      <Text style={styles.infoBtn}>Change password</Text>
                   </Pressable>

                   <Pressable style={styles.userBtn}>
                      <Text style={styles.infoBtn}>Help and Support</Text>
                   </Pressable>
                   
                   <Pressable style={styles.userBtn}>
                      <Text style={styles.infoBtn}>About</Text>
                   </Pressable>
                   <Pressable style={styles.userBtn} onPress={() => handleSignOut()}>
                      <Text style={styles.infoBtn1} >Log out</Text>
                   </Pressable>
                   </View>
                   
              </View>
        </View>

    );
}

export default SettingsPage;

const Stack = createNativeStackNavigator();

function SettingsPage(){
  

  return (
    <Stack.Navigator initialRouteName='Settings'>
      <Stack.Screen options={{headerShown: false}} name='SettingsNested' component={SettingsPageAux}/>
      <Stack.Screen name='NewPasswordScreen' options={{headerShown: true,
            headerTransparent: true,
            title:'',
            headerTintColor: '#fff',}} component={NewPasswordScreen}/>
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
    container: {
      flex:1,
      //alignItems: 'center',
      //justifyContent: 'center',
    },
    txtSet:{
      fontSize: 40,
      textAlign: 'center',
      margin: 30,
      color: 'white',
    },
    welcome: {
      margin: 50,
    },
    info:{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      borderTopLeftRadius: 70,
      borderTopRightRadius: 70
    },
    btnContainer:{
      flexDirection: 'row',
      justifyContent: "center",
      width: "75%",
      marginTop: 380,
      opacity: 0.8,
      padding: 10,
    },
    headerInfo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 90,
    },
    menuInfo:{
      marginRight: 62,
      marginLeft: 62,
    },
    userBtn:{
      textAlign:'center',
      alignItems: 'center',
      borderBottomColor: '#d5d7dd',
      borderBottomWidth: 1,
      marginTop: 20,
      },
    infoBtn:{
      fontSize: 18,
      },
    infoBtn1:{
      fontSize: 18,
      color: 'red',
    },
    headerInfoTxt:{
      fontSize: 23,
    }


})
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Button, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GetCurrentUser, SignOut } from '../FirebaseInterface';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewPasswordScreen from './NewPasswordScreen';
import globalStyles from '../assets/Stylesheet';

function SettingsPageAux({ navigation }) {

  const [email, _] = useState(() => {
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
    catch (err) {

    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Text style={globalStyles.header}>Settings</Text>
      <View style={globalStyles.container}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerInfoTxt}>{email}</Text>
        </View>

        <View style={styles.menuInfo}>

          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
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

          </ScrollView>
        </View>

      </View>
    </View>

  );
}

export default SettingsPage;

const Stack = createNativeStackNavigator();

function SettingsPage() {


  return (
    <Stack.Navigator screenOptions={{
      headerShown: true,
      //headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerShadowVisible: false,
      title: '',
      headerTintColor: '#fff',
    }} initialRouteName='Settings'>
      <Stack.Screen name='SettingsNested' component={SettingsPageAux} />
      <Stack.Screen name='NewPasswordScreen' component={NewPasswordScreen} />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  txtSet: {
    fontSize: 40,
    textAlign: 'center',
    margin: 30,
    color: 'white',
  },
  welcome: {
    margin: 50,
  },
  info: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70
  },
  btnContainer: {
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
  },
  menuInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBtn: {
    textAlign: 'center',
    alignItems: 'center',
    borderBottomColor: '#d5d7dd',
    borderBottomWidth: 1,
    marginTop: 20,
    width: '60%',
    minWidth: 200
  },
  infoBtn: {
    fontSize: 18,
  },
  infoBtn1: {
    fontSize: 18,
    color: 'red',
  },
  headerInfoTxt: {
    fontSize: 23,
  }


})
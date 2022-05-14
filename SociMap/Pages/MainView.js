import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, ImageBackground, StyleSheet, Dimensions, StatusBar } from 'react-native';

import PersonsScreen from '../screens/PersonsScreen';
import GroupScreen from '../screens/GroupScreen';
<<<<<<< HEAD
import QuizScreen from '../screens/QuizScreen';
=======
import SettingsPage from '../screens/SettingsPage';
>>>>>>> main

const Tab = createBottomTabNavigator();

const Blank = () => {
    return (
        <Text>
            HEJOOO!
        </Text>
    );
};


const background = require('../img/background.png');

const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

const styl = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height + StatusBar.currentHeight,
    },
})


export default MainView = ({}) => {
    


    return (
        <ImageBackground source={background} style={styl.backgroundImage}>
            <NavigationContainer theme={navTheme}>
                <Tab.Navigator screenOptions={{headerShown:false}}>
                    <Tab.Screen name='Persons' component={PersonsScreen}/>
                    <Tab.Screen name='Groups' component={GroupScreen}/>
                    <Tab.Screen name='Quiz' component={Blank}/>
                    <Tab.Screen name='Settings' component={SettingsPage} options={{ headerShown: false}}/>
                </Tab.Navigator>
            </NavigationContainer>
        </ImageBackground>
    );
}
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, ImageBackground } from 'react-native';

import PersonsScreen from '../screens/PersonsScreen';
import GroupScreen from '../screens/GroupScreen';

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

export default MainView = ({}) => {
    


    return (
        <ImageBackground source={background} style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0}}>
            <NavigationContainer theme={navTheme}>
                <Tab.Navigator screenOptions={{headerShown:false}}>
                    <Tab.Screen name='Persons' component={PersonsScreen}/>
                    <Tab.Screen name='Groups' component={GroupScreen}/>
                    <Tab.Screen name='Quiz' component={Blank}/>
                </Tab.Navigator>
            </NavigationContainer>
        </ImageBackground>
    );
}
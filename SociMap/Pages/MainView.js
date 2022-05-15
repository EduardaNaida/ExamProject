import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, ImageBackground, StyleSheet, Dimensions, StatusBar, View, SafeAreaView } from 'react-native';

import PersonsScreen from '../screens/PersonsScreen';
import GroupScreen from '../screens/GroupScreen';
import SettingsPage from '../screens/SettingsPage';
import { Play, PlayCircle, Settings, Sliders, User, Users } from 'react-native-feather';

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
        height: Dimensions.get('window').height //+ StatusBar.currentHeight,
    },
    icon:{
        width:'100%', 
        height:'100%', 
        alignItems:'center', 
        justifyContent:'center'
    }
})


export default MainView = ({}) => {
    


    return (
        <ImageBackground source={background} style={styl.backgroundImage}>
            <SafeAreaView style={{flex:1}}>
                <View style={{backgroundColor:'white', position:'absolute', bottom:0, height:50, left:0, right:0}}/>
                <NavigationContainer theme={navTheme}>
                    <Tab.Navigator screenOptions={{headerShown:false}}
                    >
                        <Tab.Screen name='Persons' component={PersonsScreen}
                            options={{tabBarIcon: ({focused, col, siz}) => {
                                //console.log(foc);
                                return <User color={focused ? '#ADD8E6' : 'black'}/>
                            },
                            tabBarShowLabel:false}}/>
                        <Tab.Screen name='Groups' component={GroupScreen}
                            options={{tabBarIcon: ({focused, col, siz}) => {
                                return <Users color={focused ? '#ADD8E6' : 'black'}/>
                            },
                            tabBarShowLabel:false}}/>
                        <Tab.Screen name='Quiz' component={Blank}
                            options={{tabBarIcon: ({focused, col, siz}) => {
                                return <PlayCircle color={focused ? '#ADD8E6' : 'black'}/>
                            },
                            tabBarShowLabel:false}}/>
                        <Tab.Screen name='Settings' component={SettingsPage} options={{ 
                            headerShown: false,
                            tabBarIcon: ({focused, col, siz}) => {
                                return <Sliders color={focused ? '#ADD8E6' : 'black'} rotation={90}/>
                            },
                            tabBarShowLabel:false}}/>
                    </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </ImageBackground>
    );
}
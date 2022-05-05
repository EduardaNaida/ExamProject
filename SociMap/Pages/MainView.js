import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator } from 'react-native';

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



export default MainView = ({}) => {
    


    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown:false}}>
                <Tab.Screen name='Persons' component={PersonsScreen}/>
                <Tab.Screen name='Groups' component={GroupScreen}/>
                <Tab.Screen name='Quiz' component={Blank}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
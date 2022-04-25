import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import PersonsScreen from '../screens/PersonsScreen';

const Tab = createBottomTabNavigator();

const Blank = () => {
    return (
        <Text>
            HEJOOO!
        </Text>
    );
};

export default MainView = ({SetLogged}) => {
    

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown:false}}>
                <Tab.Screen name='Persons' component={PersonsScreen}/>
                <Tab.Screen name='Groups' component={Blank}/>
                <Tab.Screen name='Quiz' component={Blank}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
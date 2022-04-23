import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import PersonsView from './PersonsView';
import PersonView from '../screens/PersonScreen'

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
            <Tab.Navigator>
                <Tab.Screen name='Persons' component={PersonsView}/>
                <Tab.Screen name='Groups' component={PersonView}/>
                <Tab.Screen name='Quiz' component={Blank}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
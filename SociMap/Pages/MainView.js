import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import PersonsView from './PersonsView';
import SettingsPage from '../screens/SettingsPage'


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
                <Tab.Screen name='Persons' component={PersonsView} options={{ headerShown: false}}/>
                <Tab.Screen name='Groups' component={Blank} options={{ headerShown: false}}/>
                <Tab.Screen name='Quiz' component={Blank} options={{ headerShown: false}}/>
                <Tab.Screen name='Settings' component={SettingsPage} options={{ headerShown: false}}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
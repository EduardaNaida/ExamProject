import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import PersonsView from "../Pages/PersonsView";
import PersonView from "./PersonScreen";

const Stack = createNativeStackNavigator();

export default PersonsScreen = () => {
    return (
        <Stack.Navigator initialRouteName="PersonsNested">
            <Stack.Screen name='PersonsNested' component={PersonsView} options={{headerShown:false}}/>
            <Stack.Screen name='Person' component={PersonView}/>
        </Stack.Navigator>
    );
}
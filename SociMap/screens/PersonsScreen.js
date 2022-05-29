import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import PersonsView from "../Pages/PersonsView";
import PersonView from "./PersonScreen";
import { SafeAreaView } from "react-native";

const Stack = createNativeStackNavigator();

export default PersonsScreen = () => {
    return (
        <Stack.Navigator initialRouteName="PersonsNested"
            screenOptions={{
                headerShown: true,
                //headerTransparent: true,
                headerStyle: {
                    backgroundColor: 'transparent',
                },
                headerShadowVisible: false,
                title: '',
                headerTintColor: '#fff',
            }}>
            <Stack.Screen name='PersonsNested' component={PersonsView} />
            <Stack.Screen name='Person' component={PersonView} />
        </Stack.Navigator>
    );
}
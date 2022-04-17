
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default LoginView = ({SetLogged}) => {
    
  return (<NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreen'>
        <Stack.Screen options={{ headerShown: false}} name="LoginScreen" component={LoginScreen} initialParams={{UpdateLogged: SetLogged}}/>
        <Stack.Screen options={{ headerShown: false}} name="ResetPasswordScreen" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>);
};
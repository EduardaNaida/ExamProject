
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageBackground, StyleSheet, Dimensions, StatusBar } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

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

export default LoginView = ({ SetLogged }) => {

  return (
    <ImageBackground source={background} style={styl.backgroundImage}>

      <NavigationContainer theme={navTheme}>
        <Stack.Navigator initialRouteName='LoginScreen'>
          <Stack.Screen options={{ headerShown: false }} name="LoginScreen" component={LoginScreen} initialParams={{ UpdateLogged: SetLogged }} />
          <Stack.Screen options={{ headerShown: false }} name="ResetPasswordScreen" component={ResetPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>);
};
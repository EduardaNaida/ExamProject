import { View, Text, StatusBar, Dimensions, StyleSheet, ImageBackground } from 'react-native';

const styl = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height + StatusBar.currentHeight,
    },
})

const background = require('../img/background.png');

export default SplashView = () => {
    return (

        <ImageBackground source={background} style={styl.backgroundImage}></ImageBackground>
    );
}
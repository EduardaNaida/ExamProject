import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

class Splash extends React.Component{
    render(){
        return(
            <View style={styles.imgContainer}>
                <Image
                  style={styles.bgImage}
                  source={require('./img/header.jpg')}
                />
            </View>
        )       
    }
}

const styles = StyleSheet.create({
  imgContainer: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: '30%',
  }
});

export default Header;
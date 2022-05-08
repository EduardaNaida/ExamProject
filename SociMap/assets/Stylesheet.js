/**
 *  Project style sheets for common styles 
 */
'use strict';
import { StyleSheet } from 'react-native';

// TODO: change folder --> ./assets? 
export default StyleSheet.create({
  header:{
    marginBottom:0,
    marginTop:30,
    marginLeft:30,
    fontSize: 40,
    color:'#fff',
    marginBottom:10,
  },
  headerImg:{
    marginTop:0,
    width:null,
    height:'60%',
  },
  });

/** 
 * Use like this: 
 * import styles from './{path}/styles';
 *      <View
            style={styles.container}>
            <Button
                style={styles.button}
                title="Go to Lucy's profile"
            />
        </View>
 */
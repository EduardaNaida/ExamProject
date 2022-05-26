/**
 *  Project style sheets for common styles 
 */
'use strict';
import { StyleSheet } from 'react-native';

// TODO: change folder --> ./assets? 
export default StyleSheet.create({
  header:{
    color:'white', 
    maxHeight:100,
    fontSize:35, 
    height:100, 
    lineHeight:120,
    alignSelf:'center', 
    textAlign:'center', 
},
  headerImg:{
    marginTop:0,
    width:null,
    height:'60%',
  },
  container:{
    //flex: 1,
    padding:10,
    //alignItems:'center',
    backgroundColor:'#ffffff',
    width:'100%',
    //height:'100%',
    top:'-40%',
    borderRadius:60,
    flexDirection:'column',
    justifyContent:'space-evenly',
    marginBottom:'-200%',
    paddingBottom:60,
    //alignItems:'center',
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
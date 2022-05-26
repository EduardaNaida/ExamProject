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
  container:{
    padding:10,
    backgroundColor:'#ffffff',
    flex:1,
    borderRadius:60,
    borderBottomEndRadius:0,
    borderBottomStartRadius:0,
    alignSelf:'stretch',
  },
  txtInput:{
    fontSize:20,
    backgroundColor:'#e3e3e3',
    textAlign:'center',
    alignSelf:'center',        
    borderRadius: 10,
    height:35,
    width:300,
    marginTop:10, 
  },

  });

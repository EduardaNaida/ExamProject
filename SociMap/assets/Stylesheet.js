/**
 *  Project style sheets for common styles 
 */
'use strict';
import { StyleSheet } from 'react-native';

// TODO: change folder --> ./assets? 
export default StyleSheet.create({
  header: {
    color: 'white',
    fontSize: 35,
    height: 60,
    alignSelf: 'center',
    textAlign: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
    flex: 1,
    borderTopRightRadius: 60,
    borderTopLeftRadius: 60,
    alignSelf: 'stretch',
  },
  txtInput: {
    fontSize: 20,
    backgroundColor: '#e3e3e3',
    color:'black',
    alignSelf: 'center',
    justifyContent:'center',
    borderRadius: 10,
    padding: 7.5,
    width: 300,
    marginTop: 10,
  },

});

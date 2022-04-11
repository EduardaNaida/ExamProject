import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Feather} from 'react-native-feather';

function GroupsScreen(props) {
    const [data, setData] = React.useState({
        index: 2,
        names: [
               {'name': 'Ikea', 'color': 'red', 'id': 1},
               {'name': 'Häst', 'color': 'blue','id': 2},
               {'name': 'Skola', 'color': 'grey','id': 3},
               {'name': 'Drivhuset', 'color': 'green','id': 4},
               {'name': 'Släkt', 'color': 'yellow','id': 5},
               {'name': 'ABB', 'color': 'pink','id': 6},
            ]
    });


        
  return (
    <View>
    <View style={styles.title}>
      <Text style={styles.titleText}>Groups</Text>
    </View>
    <View style={styles.circleContainer}>
               {
                  data.names.map((item, index) => (
                     <TouchableOpacity key = {item.id} style = {{
                     flexDirection: 'row',
                     backgroundColor: item.color,
                     width: 100,
                     height: 100,
                     borderRadius: 50, 
                     margin: 20,
                     justifyContent: 'space-evenly'}}>
                        <Text style={styles.groupName}>{item.name}</Text>
                    </TouchableOpacity>
                  ))
               }  

      </View>  
    </View>
  );
}

export default GroupsScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      marginLeft: 20,
    },
    title: {
      height: '10%',
      width: '100%',
      backgroundColor: 'grey',
    },
    titleText: {
        fontSize: 30,
        textAlign: 'left',
        color: 'white',
      },
    circleContainer: {
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flexDirection: 'row',
    margin: 20,
    },

    circle: {
      flexDirection: 'row',
      width: 100,
      height: 100,
      borderRadius: 50, 
      justifyContent: 'space-evenly',
    },
    groupName: {
      flexWrap: 'wrap',
      color: 'white',
      fontSize: 20,
      marginTop: 35,
    },
    btnContainer:{
      flexDirection: 'row',
      justifyContent: "space-between",
      width: "75%",
    },
    userBtn:{
      borderRadius: 25,
      backgroundColor: "#FF38E2",
      padding: 15,
      width: "45%"
    },
    btnTxt:{
      fontSize: 16,
      textAlign: "center",
    },
    forgot_button: {
      height: 30,
      marginBottom: 30,
    }
  });
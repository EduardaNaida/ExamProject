import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Edit, Trash } from 'react-native-feather';

export default function PersonScreen({navigation}){

    // TODO: Fetch data from user input 
    personName = "NAME: Greta Garbo";
    categories = ["Title:", "Workplace:", "Family:", "Hobbies:", "Other info:"];
    title = "CEO";
    workplace = "The House of ABCD";
    family = "Kids: Ada, Love och Lace, Wife: Grynet";
    hobbies = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sollicitudin molestie massa, ut ullamcorper sem congue commodo. In tempor lectus sem, ac molestie magna feugiat vitae. ";
    other = "Does not like peanuts";
  
    return (
    

    <View style={styles.container}>
        <Text style={styles.nameHeader}>{personName}</Text>
        <Text style={styles.categoryTitle}>{categories[0]}</Text>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{title}</Text>
        </View>
        <Text style={styles.categoryTitle}>{categories[1]}</Text>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{workplace}</Text>
            </View>
        <Text style={styles.categoryTitle}>{categories[2]} </Text>
        <View style={styles.categoryContainer}><Text style={styles.categoryText}>{family}</Text>
            </View>
        <Text style={styles.categoryTitle}>{categories[3]} </Text>
        <View style={styles.categoryContainer}><Text style={styles.categoryText}>{hobbies}</Text>
            </View>
        <Text style={styles.categoryTitle}>{categories[4]} </Text>
        <View style={styles.categoryContainer}><Text style={styles.categoryText}>{other}</Text>
            </View>
        <View style={styles.btnContainer}>
            
            <TouchableOpacity style={styles.userBtn}>
                <Trash 
                // TODO: OnPress ==> Are you sure, if yes ==> Delete, otherwise Nothing
                name = 'trash'
                color = 'black'
                alignSelf = 'center'
                />
            </TouchableOpacity> 
            <TouchableOpacity style={styles.clickBtn}>
                <Edit 
                // TODO: New screen to edit a contact? 
                name = 'edit'
                color = 'black'
                alignSelf = 'center'
                />
            </TouchableOpacity> 
        </View>
      </View>
      
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#ffffff',
      justifyContent: 'flex-start',
    },
    nameHeader: {
        marginTop: 10,
        flex: 0,
        padding:10,
        //backgroundColor: "#E98D79",       // used for debugging
        textAlign: 'center',
        fontSize: 30,
        alignSelf:'center',
    },
    categoryContainer: {
        flexDirection: 'column',
        justifyContent:'flex-start',
        width: "85%",
        padding: 10,
        backgroundColor: "#d3d3d3",
        borderRadius: 15,
        alignSelf:'center',
    },
    categoryTitle: {
        marginTop: 20,
        paddingVertical: 5,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 10,
        color: "#000000",
        textAlign: 'auto',
        fontSize: 20,
    },
    categoryText: {
        padding: 0,
        fontSize: 15,
        textAlign: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: "space-around",
      width: "100%",
    },
    clickBtn:{
        marginTop:50,
        borderRadius: 20,
        backgroundColor: "#c97ba1",
        padding: 10,
        width: "20%"
      //},
      //btnTxt:{
      //  fontSize: 16,
      //  textAlign: "center",
      },
  });
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Edit, Trash } from 'react-native-feather';

export default function PersonScreen({navigation}){

    // TODO: Fetch data from user input, stored in database 
    // TODO: is it better to store the values as an array in categories? 
    // categories = [["Title:", "abcde"], ["Workplace:",["ackis"]]]
    personName = "Greta Garbo";
    categories = ["Title:", "Workplace:", "Group:", "Family:", "Hobbies:", "Other info:"];
    title = "CEO";
    workplace = "The House of ABCD";
    group = "IKEA";
    family = ["Kids:", "Ada", "Love", "Lace", "Wife:", "Grynet"];
    hobbies = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sollicitudin molestie massa, ut ullamcorper sem congue commodo. In tempor lectus sem, ac molestie magna feugiat vitae. ";
    other = "Does not like peanuts";
    // Used for allContacts to sort contacts alphabetically  
    alphabeticalOrder = personName.charAt(0);


    return (
    
    // TODO: Check variable names and structure 
    // TODO: If category empty ==> hide category
    <View style={styles.container}> 
    <ScrollView>
        <Text style={styles.pageHeader}>{personName}</Text>
        <Text style={styles.categoryTitle}>{categories[0]}</Text>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{title}</Text>
        </View>
        <Text style={styles.categoryTitle}>{categories[1]}</Text>
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{workplace}</Text>
            </View>
        <Text style={styles.categoryTitle}>{categories[2]} </Text>
        <View style={styles.categoryContainer}><Text style={styles.categoryText}>{group}</Text>
            </View>
        <Text style={styles.categoryTitle}>{categories[3]} </Text>
        <Text style={styles.subCategoryText}>{family[0]}</Text>
            <View style={styles.categoryContainer}><Text style={styles.categoryText}>{family[1]}</Text>
            </View>
            <View style={styles.categoryContainer}><Text style={styles.categoryText}>{family[2]}</Text>
            </View>
            <View style={styles.categoryContainer}><Text style={styles.categoryText}>{family[3]}</Text>
            </View>
            <Text style={styles.subCategoryText}>{family[4]}</Text>
            <View style={styles.categoryContainer}><Text style={styles.categoryText}>{family[5]}</Text>
            </View>
            
        <Text style={styles.categoryTitle}>{categories[4]} </Text>
        <View style={styles.categoryContainer}><Text style={styles.categoryText}>{hobbies}</Text>
            </View>
        <Text style={styles.categoryTitle}>{categories[5]} </Text>
        <View style={styles.categoryContainer}><Text style={styles.categoryText}>{other}</Text>
            </View>

        
        <View style={styles.btnContainer}>    
            <TouchableOpacity style={styles.clickBtn}>
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
        </ScrollView>
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
    pageHeader: {
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
    subCategoryTitle: {
        marginTop: 20,
        //paddingVertical: 5,
        //borderRadius: 10,
        color: "#000000",
        alignSelf: 'auto',
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
    },
      //},
      //btnTxt:{
      //  fontSize: 16,
      //  textAlign: "center",
      
  });
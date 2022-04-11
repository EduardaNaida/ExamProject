import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import { Edit, Trash, X, Plus, Save } from 'react-native-feather';

function EditPersonScreen(props){
    const [data, setData] = React.useState({
        name: '',
        title: '',
        workplace: '',
        group: '',
        family: '',
        hobbies:'',
        other:''
    });

    // TODO: Fetch data from AddPerson 
    var pageTitle = "EDIT: ";
    var personName = pageTitle + "Greta Garbo";
    var categories = ["Title:", "Workplace:", "Group:", "Family:", "Hobbies:", "Other info:"];
    var title = "CEO";
    // TODO: Allow previous workplaces? 
    var workplace = "The House of ABCD";
    var group = "IKEA";
    var family = {
        "NumKids": 3, // update 
        "Kid1": "Ada", 
        "Kid2": "Love", 
        "Kid3": "Lace",
        "Wife": "Grynet",
        "Husband": null,
        "Grandfather": null,
        "Grandmother": null
    }
    // TODO: Allow multiple hobbies 
    var hobbies = "TEST for longer text inputs: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sollicitudin molestie massa, ut ullamcorper sem congue commodo. In tempor lectus sem, ac molestie magna feugiat vitae. ";
    var other = "Does not like peanuts";

    // TODO: Used for allContacts to sort contacts alphabetically, to simplify categorization
    // when viewing list of persons 
    //alphabeticalOrder = personName.charAt(0);
    
    function renderText(array) {
        return array.map(obj => {
          return <Text>family</Text>
        });
      }
    // TODO: Family relation variable should be dynamic, find entries in the dictionary 


    return (
        <View>
        <ScrollView>

        <Text style={styles.pageHeader}>{personName}</Text>
        
        <Text style={styles.editHeader}> Edit {categories[0]}</Text>
        <TextInput 
          style={styles.input}
          placeholder={title}
          value={data}
          onChangeText={(data) => setData(data)}/>
          
        <Text style={styles.editHeader}> Edit {categories[1]}</Text>
        <TextInput 
          style={styles.input}
          placeholder={workplace}
          value={data}
          onChangeText={(data)=> setData}/>

        <Text style={styles.editHeader}> Edit {categories[2]}</Text>
        <TextInput 
          style={styles.input}
          placeholder={group}
          value={data}
          onChangeText={(data)=> setData}></TextInput>

        <Text style={styles.editHeader}> Edit {categories[3]}</Text>
        <Text style={styles.subEditHeader}>Kids</Text>
        <TextInput 
          style={styles.input}
          placeholder={family["Kid1"]}
          value={data}
          onChangeText={(data)=> setData}></TextInput>
        <TextInput 
          style={styles.input}
          value={data}
          placeholder={family["Kid2"]}
          onChangeText={(data)=> setData}/>
        <TextInput 
          style={styles.input}
          value={data}
          placeholder={family["Kid3"]}
          onChangeText={(data)=> setData}/>
        <Text style={styles.subEditHeader}>Wife: </Text>
        <TextInput 
          style={styles.input}
          value={data}
          placeholder={family["Wife"]}
          onChangeText={(data)=> setData}></TextInput>
        <Text style={styles.editHeader}> Edit {categories[4]}</Text>
        <TextInput 
          style={styles.input}
          placeholder={hobbies}
          value={data}
          onChangeText={(data)=> setData}></TextInput>
        <View style={styles.btnContainer}>    
        <TouchableOpacity style={styles.btn}>
            <Plus 
                // TODO: OnPress ==> Are you sure, if yes ==> Delete, otherwise Nothing
                name = 'trash'
                color = 'black'
                alignSelf = 'center'
            /></TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
            <Save 
                // TODO: OnPress ==> Are you sure, if yes ==> Delete, otherwise Nothing
                name = 'trash'
                color = 'black'
                alignSelf = 'center'
            />
            </TouchableOpacity></View> 
        </ScrollView>
        </View>
        // TODO: For TextInput: onSubmitEditing={(value) => setName(value.nativeEvent.text)} 
        // When a user submits the changes instead of changetextr
    
    // TODO: Check variable names and structure 
    // TODO: If category empty ==> hide category
    // TODO: Add for-loop to generate categoryContainers  
    );
};   
export default EditPersonScreen;

const styles = StyleSheet.create({
    pageHeader: {
        marginTop: 10,
        flex: 0,
        padding:10,
        textAlign: 'center',
        fontSize: 30,
        alignSelf:'center',
    },
    editHeader: {
        fontSize: 22,
        padding: 5,
    },
    subEditHeader: {
        fontSize: 20,
        padding: 3, 
    },
    btn: {
        marginTop:50,
        borderRadius: 20,
        backgroundColor: "#c97ba1",
        padding: 10,
        width: "20%"
    },
    btnContainer: {
        flexDirection: 'row-reverse',
        //justifyContent: "flex-end",
        width: "100%",
    },
    input: {
        margin: 15,
        padding:10,
        borderColor: "#000000",
        borderWidth: 1
    }
  });
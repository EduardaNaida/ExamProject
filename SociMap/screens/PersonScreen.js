import React, { useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput, Image } from 'react-native';
import { Edit, Trash, Delete} from 'react-native-feather';



const PersonThumbnail = ({personData}) =>
{
    const [acro, _] = useState(() => {
        console.log(personData)
        const str = personData.name;
        const matches = str.match(/\b(\w)/g);
        const acronym = matches.join('').substring(0,2); 
        return acronym;
    });
    if(personData.img != '' && personData.img){
        return (
            <Image style={styles.thumbnail}
            source={{uri:personData.img}}/>
        );
    }

    return (<Text style={{
            backgroundColor:personData.color, 
            ...styles.thumbnail,
            ...styles.thumbnailText
        }}>
            {acro}
        </Text>);
}

const Section = ({dispatch, sectionData}) => {

    return (
        <View key={sectionData.headline}>
            <Text>{sectionData.headline}</Text>
            {
                sectionData.notes.map(note => <Note note={note}></Note>)
            }
        </View>
    );
}

const Note = ({dispatch, note}) => {
    const input = useRef();
    const [text, setText] = useState(note);
    const [editable, setEditable] = useState(false);
    console.log(editable);

    return (
        <View key={note}>

            <TextInput 
                editable={editable} 
                onFocus={() => setEditable(true)} 
                onBlur={() => setEditable(false)} 
                value={text} 
                ref={input} 
                onChangeText={setText}/>
            <Button onPress={() => {setEditable(true); setTimeout(() => input.current.focus(), 10);} } title='hej'></Button>
        </View>
    );
}

export default function PersonView() {
   const [state, dispatch] = useReducer(()=>{}, {name:'Lucas Berg', color:'red', img:null, notes:[{headline:'emails', notes:['test@test.com']}]});
    return (
        <View>
            <ScrollView>
                <PersonThumbnail personData={state}/>
                <Text>{state.name}</Text>

                {
                    state.notes.map(section => <Section sectionData={section}></Section>)
                }
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
    thumbnail:{
        width:70,
        height:70,
        borderRadius:35,
    },
    thumbnailText:{
        fontSize:30,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
      //},
      //btnTxt:{
      //  fontSize: 16,
      //  textAlign: "center",
      
  });
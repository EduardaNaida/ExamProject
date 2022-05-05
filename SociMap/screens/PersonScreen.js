import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, SafeAreaView, TextInput, Image, ActivityIndicator, Pressable, ImageBackground, Alert } from 'react-native';
import { Edit, Trash, Delete, Plus, X, Save, Settings} from 'react-native-feather';
import { AddValueToNoteCustomId, GetPersonData, RemoveNote, RemoveValueFromNote, UpdateValueOfNote, AddNoteCustomId, SetPersonImage, UpdatePersonFields } from '../FirebaseInterface';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { Row } from 'react-native-table-component';

// TODO: lägg över alla stylesheets i Stylesheet   
// import styles from './Stylesheet'

/** TODO: ändra funktionen createAlert --> byt till en popup-meny? 
 *        används för att ta bort en hel kategori 
 *  till denna kanske? https://morioh.com/p/425dc0fcdf7d 
 *  eller denna: https://hartaniyassir.medium.com/how-to-create-a-popup-menu-in-react-native-d2fc8908e932
 *  eller denna: https://reactnativecode.com/popup-menu-overflow-menu-in-react-navigation/ 
 *  tanke: onClick - få upp popup-meny 
 */

 /** 
 *  TODO: Ändra storlek på text när man lägger till ny kategori 
 *  TODO: Ändra design på textInput
 *  TODO: Ändra kategori-titeln så den är flexDir:'row', settings-knappen bredvid 
 *  
 */

const PersonThumbnail = ({personData}) =>
{
    const [acro, _] = useState(() => {
        if(!personData.name)
            return '';

        const str = personData.name + '';
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
            
        </Text>
        );
}



const Section = ({dispatch, sectionData, personId, isCreatingNew}) => {
    
    const [adding, setAdding] = useState(false);
    const [text, setText] = useState('');
    const input = useRef();

    const buttonClicked = () => {
        setAdding(true);
        setTimeout(() => input.current.focus(), 10);
    };

    const textFinished = async () => {
        input.current.blur();
        setAdding(false);
        if(text != ''){
            console.log('adding note:', text);
            const id = uuid.v4();

            if(!isCreatingNew)
                AddValueToNoteCustomId(personId, sectionData.id, text, id);
            const v = {
                value:text,
                id:id
            }
            setText('');
            dispatch({type:'add value', noteId:sectionData.id, value:v});
        }
    }

    const removeNote = () => {
        if(!isCreatingNew)
            RemoveNote(personId, sectionData.id);
        dispatch({type:'remove note', noteId:sectionData.id})
    }

    const createAlert = () =>
    Alert.alert(
      "What do you want to do?",
      "",
      [
        {
          text: "Edit category name", 
          onPress: () => console.log("Cancel Pressed")
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete category", onPress: removeNote }
      ]
    );

    return (
        <View style={{flexDirection:'column',alignItems:'center'}}> 
            <View style={styles.categoryContainer}>
                <TouchableOpacity onPress={createAlert}>
                    <Text style={styles.categoryText}>{sectionData.headline}</Text>
                    <Settings style={styles.deleteButton}/>
                    </TouchableOpacity>  
                
                        </View>
            {
                sectionData.values.map(note => 
                <Note 
                    style={styles.txtContainer}
                    key={note.id} 
                    value={note} 
                    dispatch={dispatch} 
                    personId={personId} 
                    noteId={sectionData.id}
                    isCreatingNew={isCreatingNew}
                />)
            }
            
            {
                adding ?
                    <TextInput style={styles.txtInputView}
                    ref={input} onChangeText={setText} onBlur={textFinished}></TextInput>
                :
                    <Pressable 
                    style={styles.button}
                    onPress={buttonClicked}><Plus style={styles.addButton}/>
                        </Pressable>
            }
        </View>
    );
}

const Note = ({dispatch, value, personId, noteId, isCreatingNew}) => {
    //console.log(value);
    const input = useRef();
    const [text, setText] = useState(value.value);
    const [editable, setEditable] = useState(false);
    //console.log(editable);
    const header_name = "People";

    const updateText = async () => {
        setEditable(false);

        if(value.value == text)
            return;

        if(text == ''){
            if(!isCreatingNew)
                RemoveValueFromNote(personId, noteId, value.id);
            dispatch({type:'remove value', noteId: noteId, valueId:value.id});
            return;
        }
        
        if(!isCreatingNew)
            UpdateValueOfNote(personId, noteId, value.id, text);
        dispatch({type:'update value', noteId: noteId, valueId:value.id, newValue:text});
    };

    return (
        <View style={styles.txtContainer}>
            {
                editable ? 
                <TextInput 
                    style={styles.txtInputView}
                    onFocus={() => setEditable(true)} 
                    onBlur={updateText} 
                    value={text} 
                    ref={input} 
                    onChangeText={setText}
                    multiline={true}/>
                :
                
                <Text style={styles.valuesText}>{text}</Text>
            }
            <Pressable 
                onPress={() => {setEditable(true); 
                setTimeout(() => input.current.focus(), 10);
            } }>
                <Edit style={styles.editButton}/></Pressable>
        
        </View>
    );
}

function stateUpdater(state, action) {
    switch (action.type) {
        case 'init':
            return action.data;
        case 'add value':
            const addIndex = state.notes.findIndex(val => val.id == action.noteId);
            state.notes[addIndex].values.push(action.value);
            return {...state};
        case 'remove value':
            const removeIndex = state.notes.findIndex(val => val.id == action.noteId);
            const removeSubIndex = state.notes[removeIndex].values.findIndex(val => val.id == action.valueId);
            state.notes[removeIndex].values.splice(removeSubIndex, 1);
            return {...state};
        case 'update value':
            const updateIndex = state.notes.findIndex(val => val.id == action.noteId);
            const updateSubIndex = state.notes[updateIndex].values.findIndex(val => val.id == action.valueId);
            state.notes[updateIndex].values[updateSubIndex].value = action.newValue;
            return {...state};
        case 'remove note':
            const noteRemoveIndex = state.notes.findIndex(val => val.id == action.noteId);
            state.notes.splice(noteRemoveIndex, 1);
            return {...state};
        case 'add note':
            state.notes.push(action.note)
            return {...state}
        case 'update img':
            return {
                ...state,
                img:action.url
            };
        case 'update name':
            return {
                ...state,
                name:action.name
            };
        default:
            break;
    }
    console.log('unkown action');
    return state;
}

export default function PersonView({navigation, route}) {
    const [state, dispatch] = useReducer(stateUpdater, null);   
    const [adding, setAdding] = useState(false);
    const [text, setText] = useState('');
    const input = useRef();

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState('');
    const nameInput = useRef();

    const personId = route.params.personId;
    const isCreatingNew = route.params.isCreatingNew;
 

    useEffect(()=>{
        
        if(!isCreatingNew){
            GetPersonData(personId).then(x=>{
                dispatch({type:'init', data:x});
            })
            return;
        }

        dispatch({type:'init', data:{
            name:'',
            img:'',
            color:'red',
            notes:[]
        }});
    }, []);

    useEffect(()=>{
        //console.log(state);
        
        navigation.setOptions({
            headerRight: () => SaveButton(state), 
        });
    }, [state]);

    const SaveButton = (stat) => {
        const pressed = () => {
            //console.log(stat);
            if(!stat?.name){
                alert('No name!');
                navigation.pop();
                return;
            }

            navigation.navigate({
                name: 'PersonsNested',
                params: { Post: JSON.stringify(stat) },
                merge: true,
            });
        }

        return (
                <Pressable  
                    onPress={pressed}>
                    <Save style={styles.saveButton}/>
                    </Pressable>
        );
    }

    
    const buttonClicked = (i, setter) => {
        setter(true);
        setTimeout(() => i.current.focus(), 10);
    };

    
    const textFinished = async () => {
        input.current.blur();
        setAdding(false);
        if(text != ''){
            console.log('adding note:', text);
            const id = uuid.v4();
            if(!isCreatingNew)
                AddNoteCustomId(state.id, text, id);
            
            setText('');
            dispatch({type:'add note', note:{id:id, headline:text, values:[]}});
        }
    };

    const nameFinished = async () => {
        nameInput.current.blur();
        setEditingName(false);
        
        if(!isCreatingNew)
            UpdatePersonFields(personId, {name:name});

        dispatch({type:'update name', name:name});
        setName('');
    };

    const setImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
        });

        if(result.cancelled)
            return;

        if(!isCreatingNew){
            const uri = await SetPersonImage(state.id, result.uri);
            dispatch({type:'update img', url:uri});
            return;
        }

        dispatch({type:'update img', url:result.uri});
    };



    if(state == null)
        return(<ActivityIndicator style={styles.indicator} size='large'/>)

    //console.log(state.name);

    return (
        
        <View style={{flex:1}}>
            <ImageBackground 
                source={require('../Pages/img/header.png')}
                style={styles.headerImg}><Text style={styles.header}>{"SociMap"}</Text>
                </ImageBackground>
            <View style={styles.container}>
                <ScrollView style={styles.scroller}>
                    <TouchableOpacity onPress={setImage}>
                        <PersonThumbnail personData={state}/>
                    </TouchableOpacity>

                    {
                        editingName ?
                            <TextInput
                                style={styles.txtInputView}
                                ref={nameInput}
                                onChangeText={setName}
                                onBlur={nameFinished}
                            />
                            :
                            <>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameText}>{state.name}</Text>
                                <Pressable 
                                    onPress={() => 
                                    buttonClicked(nameInput, setEditingName)}>
                                    <Edit
                                        style={styles.nameEditButton}/>
                                </Pressable>
                            </View></>
                    }
                    
                    

                {
                    state.notes.map(section => 
                        <Section 
                            key={section.id} 
                            sectionData={section} 
                            dispatch={dispatch} 
                            personId={state.id}
                            isCreatingNew={isCreatingNew}
                            />
                        )
                }
                
                {
                    adding ?
                    <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>{'Category name:'}</Text>
                        <TextInput style={styles.txtInputView}
                        ref={input} 
                        onChangeText={setText} 
                        onBlur={textFinished}></TextInput>
                        </View>
                    :
                    <>
                    
                        <Pressable 
                            title='Add headline' 
                            style={styles.addCategoryStyle}
                            onPress={() => buttonClicked(input, setAdding)}><Text style={styles.buttonText}>{'New category'}</Text>
                            </Pressable> 
                            </>
                }
        </ScrollView>
        </View>        
    </View>
    );
};

const styles = StyleSheet.create({
    // TODO: Same as in PersonsView, move to global 
    indicator:{
        marginTop:'50%',

    },
    header:{
        //marginTop: 80,
        marginBottom:0,
        marginTop:30,
        marginLeft:30,
        fontSize: 40,
        //marginLeft:-150,
        color:'#fff',
        marginBottom:10,
    },
    scroller:{
        flexGrow:1,
        height:800,
        width:'100%',
        paddingBottom:50,
    },
    headerImg:{
        marginTop:0,
        //flex:1, 
        width:null,
        height:'60%',
    },
    thumbnail:{
        alignSelf:'center',
        marginTop:20,
        width:70,
        height:70,
        borderRadius:35,
    },
    thumbnailText:{
        fontSize:20,
        backgroundColor:'lightblue',
        textAlignVertical: 'center',
        marginBottom:-40,
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
    txtContainer:{
        //flex:1,
        margin:10,
        //height:40,
        padding:7,
        flexDirection:'row',
        backgroundColor:'#D2F2CB', // TODO: The color of user-choice (from group)
        justifyContent:'center',
        borderRadius:10,
        width:319,
    },
    txtInputView:{
        backgroundColor:'orange',
        fontSize:20,
        height:40,
        borderRadius:10,
        paddingLeft:10,
        margin:10,
        width:319,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    categoryText:{
        fontSize:24,
        color:'black',
        textAlign:'left',
    },
    categoryContainer:{
        //backgroundColor:'lightgray',
        borderWidth:1,
        borderColor:'black',
        borderRadius:20,
        flexDirection:'row',
        alignSelf:'flex-start',
        //alignSelf: 'center',
//        alignContent:'space-between',
        justifyContent:'center',
        paddingTop:20,
    },
    nameContainer:{
        flex:1,
        flexDirection:'row',
        alignSelf:'center',
        alignContent:'space-between',
        justifyContent:'center',
    },
    nameText:{
        fontSize:30,
        color:'black',
        marginLeft:40,
        marginTop:10,
        textAlign:'center',
        marginBottom:20,
    },
    valuesText:{
        fontSize:19,
        textAlign:'left',
        marginLeft:10,
        marginRight:-10,
        alignSelf:'flex-start',
        justifyContent:'center',
        width:'90%'
        //padding:10,
    },
    // TODO: Same as in PersonsView, move to global file? 
    // START ----- 
    buttonView:{
        backgroundColor:'#ADD8E6',
        borderRadius:10,
        width:'30%',
        margin:5,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-evenly',
        //alignSelf:'center',
    },
    button:{
        height:30,
        width:50,
        backgroundColor:'lightgrey',
        //alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,

    },
    iconButton:{
        height:40,
        width:40,
        color:'black',
    },
    deleteButton:{
        height:40,
        width:40,
        color:'grey',
        marginLeft:10,
        //alignSelf:'flex-end'
    },
    nameEditButton:{
        height:40,
        width:40,
        marginTop:15,
        marginLeft:30,
        color:'gray',
//        alignSelf:'center',
    },
    editButton:{
        height:40,
        width:40,
        color:'gray',
//        alignSelf:'center',
    },
    addCategoryStyle:{
        backgroundColor:'lightgrey',
        width:'35%',
        padding:7.5,
        marginTop:20,
        borderRadius:20,
    },
    addButton:{
        color:'gray',
        margin:10,
        alignSelf:'center',
        //marginLeft:20,
    },
    saveButton:{
        height:40,
        width:40,
        color:'black',
    },
    buttonText:{
        fontSize:20,
        alignSelf:'center',
        borderRadius:20,
    },
    buttonStyle:{
        width:70,
        height:40,
        borderRadius:10,
        alignSelf:'flex-start',
        backgroundColor:'#ADD8E6',
        opacity:0.8,
    },
    /// ------- END
});
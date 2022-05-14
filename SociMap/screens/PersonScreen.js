import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, ActivityIndicator, Pressable, ImageBackground, Alert } from 'react-native';
import { Edit, Plus, Save, Settings, Check} from 'react-native-feather';
import { AddValueToNoteCustomId, GetPersonData, RemoveNote, RemoveValueFromNote, UpdateValueOfNote, AddNoteCustomId, SetPersonImage, UpdatePersonFields } from '../FirebaseInterface';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';

import { Menu, Divider, Provider, Button } from 'react-native-paper'; 

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
 *  TODO: Formatera TextInput så att den öppnas i en 'alert'-liknade view och är placerad på samma ställe för alla typer av inputs 
 *  
 */

/** 
 * OVERFLOW MENU
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


const Section = ({dispatch, sectionData, personId, isCreatingNew, editing}) => {
    
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

    const alertDeletion = () =>
    Alert.alert(
        // Alert messages 
        "Are you sure you want to delete this category?",
        "This will delete all entries in the category.",
      [{
          text: "Yes", onPress: removeNote 
        },{
          text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel"
        }]
    );

    const alertMsg = () => 
    Alert.alert(
        "Edit category name not implemented.",
        "",
        [{
                text: 'Return', onPress: () => console.log('Return pressed'), style: 'cancel'
            }])

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => {
        if(editing) setVisible(true);
    };
    const closeMenu = () => setVisible(false);

    return (
            <View style={styles.categoryView}> 
                <View style={styles.categoryContainer}>
                    <Provider>
                        <Menu 
                            style={styles.menu}
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={
                            <TouchableOpacity style={{flexDirection:'row', alignSelf:'center', alignConten:'center'}}onPress={openMenu}>
                                <Text style={styles.categoryTitle}>{sectionData.headline}</Text>
                                {
                                    editing ?
                                    <Settings style={styles.settingsButton}/>
                                    :
                                    <></>
                                }
                            </TouchableOpacity>}>
                            <Menu.Item style={styles.menuItem} onPress={() => alert('yoo')} title='Edit category'/>
                            <Divider/>
                            <Menu.Item style={styles.menuItem} onPress={alertDeletion} title='Delete category'/>    
                        </Menu>
                    </Provider>
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
                    editing={editing}
                />)
            }
            
            {
                adding ?
                <View style={styles.txtContainer}>
                    <TextInput style={styles.inputView}
                    ref={input} onChangeText={setText} onBlur={textFinished}></TextInput>
                </View>
                :
                (
                    editing ?
                    <Pressable 
                        style={styles.button}
                        onPress={buttonClicked}><Plus style={styles.addButton}/>
                    </Pressable>
                    :
                    <></>
                )
            }
            </View>
    );
}

const Note = ({dispatch, value, personId, noteId, isCreatingNew, editing}) => {
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
                    style={styles.inputView}
                    onFocus={() => setEditable(true)} 
                    onBlur={updateText} 
                    value={text} 
                    ref={input} 
                    onChangeText={setText}
                    multiline={true}/>
                :
                
                <Text style={styles.categoryText}>{text}</Text>
            }
            {
                editing ?
                <Pressable 
                    onPress={() => {setEditable(true); 
                    setTimeout(() => input.current.focus(), 10);
                } }>
                    <Edit style={styles.editButton}/>
                </Pressable>
                :
                <></>
            }
        
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

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            title:'',
            headerTintColor: '#fff',
          });
    }, []);

    
    const [state, dispatch] = useReducer(stateUpdater, {notes:[]});   
    const [adding, setAdding] = useState(false);
    const [text, setText] = useState('');
    const input = useRef();
    
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState('');
    const nameInput = useRef();
    
    const personId = route.params.personId;
    const isCreatingNew = route.params.isCreatingNew;
    
    const [editing, setEditing] = useState(isCreatingNew);
    
    const [prev, _] = useState(() => {
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2];

        console.log(prevRoute.name);
        return prevRoute.name;
    })
 

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
        if(isCreatingNew){
            navigation.setOptions({
                headerRight: () => SaveButton(state), 
            });
            return;
        }

        navigation.setOptions({
            headerRight: () => ConfigureButton(editing, setEditing), 
        });

    }, [state, route.params, editing]);

    const ConfigureButton = (edit, set) => {
        if(edit){
            return (
                <View style={{alignSelf:'flex-end'}}>
                    <Pressable  
                        onPress={() => set(false)}>
                            
                        <Check style={styles.saveButton} color='white'/>
                            
                    </Pressable>
                </View>
            );
        }

        return(
            <View style={{alignSelf:'flex-end'}}>
                <Pressable  
                    onPress={() => set(true)}>
                        
                    <Settings style={styles.saveButton} color='white'/>
                        
                </Pressable>
            </View>
        );
    }

    const SaveButton = (stat) => {
        const pressed = () => {
            //console.log(stat);
            if(!stat?.name){
                alert('No name!');
                navigation.pop();
                return;
            }

            console.log(prev);

            navigation.navigate({
                name: prev,
                params: { Post: JSON.stringify(stat) },
                merge: true,
            });
        }

        return (
            <View style={{alignSelf:'flex-end'}}>
                <Pressable  
                    onPress={pressed}>
                        
                    <Save style={styles.saveButton} color='white'/>
                        
                </Pressable>
            </View>
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

        if(name == ''){
            alert('Invalid name');
            setName(state.name);
            return;
        }
        
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


    //console.log(state.name);

    return (
        
        <View style={{flex:1}}>
            <Text style={styles.header}>{state.name}</Text>
            <View style={styles.container}>
                <ScrollView 
                    style={styles.scroller}
                    showsVerticalScrollIndicator={true}>
                    <TouchableOpacity onPress={setImage} style={{width:70, height:70, borderRadius:35, alignSelf:'center', marginTop:10}} disabled={!editing}>
                        <PersonThumbnail personData={state}/>
                    </TouchableOpacity>

                    {
                        editingName ?
                            <TextInput
                                style={styles.inputView}
                                ref={nameInput}
                                onChangeText={setName}
                                onBlur={nameFinished}
                            />
                            :
                            <>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameText}>{state?.name ? state?.name : ''}</Text>
                                {
                                    editing ? 
                                        <Pressable 
                                        onPress={() => 
                                        buttonClicked(nameInput, setEditingName)}>
                                        <Edit
                                            style={styles.nameEditButton}/>
                                        </Pressable>
                                        :
                                        <></>
                                }
                                
                            </View></>
                    }
                    
                    

                    <View style={{flex:1, justifyContent:'center'}}>
                    {
                        state.notes.map(section => 
                            <Section 
                                key={section.id} 
                                sectionData={section} 
                                dispatch={dispatch} 
                                personId={state.id}
                                isCreatingNew={isCreatingNew}
                                editing={editing}
                                />
                            )
                    }
                    </View>
                
                {
                    adding ?
                    <View style={{flexDirection:'column', alignContent:'center'}}>
                        <Text style={styles.newTitle}>{'Category name:'}</Text>
                            <View style={styles.categoryContainer}>
                        <TextInput style={styles.inputView}
                        ref={input} 
                        onChangeText={setText} 
                        onBlur={textFinished}></TextInput>
                        </View>
                        </View>
                    :
                    <>
                    {
                        editing ? 
                        <Pressable 
                            title='Add headline' 
                            style={styles.addCategoryStyle}
                            onPress={() => buttonClicked(input, setAdding)}><Text style={styles.buttonText}>{'New category'}</Text>
                        </Pressable>
                        :
                        <></> 
                    }
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
        color:'white', 
        fontSize:40, 
        height:100, 
        alignSelf:'center', 
        textAlign:'center', 
        textAlignVertical:'center'
    },
    scroller:{
    },
    headerImg:{
        marginTop:0,
        //flex:1, 
        width:null,
        height:'60%',
    },
    thumbnail:{
        alignSelf:'center',
        width:70,
        height:70,
        borderRadius:35,
    },
    thumbnailText:{
        fontSize:20,
        backgroundColor:'lightblue',
        textAlignVertical: 'center',
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
    txtContainer:{
        //flex:1,
        margin:10,
        position:'relative',
        padding:7,
        flexDirection:'row',
        backgroundColor:'#D2F2CB', // TODO: The color of user-choice (from group)
        justifyContent:'center',
        alignSelf:'center',
        borderRadius:10,
        width:319,
    },
    inputView:{
        backgroundColor:'#00000000',
        borderBottomColor:'black',
        borderBottomWidth:1,
        fontSize:20,
        height:30,
        paddingLeft:15,
        width:'90%',
        alignSelf:'center',
        textAlign:'center',
    },
    newTitle:{
        fontSize:20,
        color:'black',
        textAlign:'left',
    },

    menuContainer:{
        //paddingTop:50,
        flexDirection: 'row',
        //justifyContent:'center',
        zIndex:100,
    },
    menuItem:{
        height:30,
    },
    menu:{
        backgroundColor:'#fff',
        borderRadius:20,
        borderWidth:0,
        top:-80,
        left:0, 
        position:'absolute',
        zIndex:100,
    },
    categoryView:{
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
        alignSelf:'flex-start',
    },
    categoryContainer:{
        flexDirection:'row',
        marginTop:10,
        borderWidth:0.7,
        borderColor:'black',
        backgroundColor:'#ebebeb',
        borderRadius:10,
        width:'60%',
        padding:7,
        alignSelf:'center',
        marginBottom:10,
    },
    categoryTitle:{
        fontSize:24,
        color:'black',
        textAlign:'center',
        margin:5,
        alignSelf:'center',
    },    
    categoryText:{
        fontSize:19,
        //textAlign:'left',
        //marginLeft:10,
        //marginRight:-10,
        justifyContent:'center',
        alignSelf:'center',
    },
    settingsButton:{
        height:40,
        width:40,
        color:'grey',
        alignSelf:'center',
    },
    nameContainer:{
        minWidth:150,
        flexDirection:'row',
        alignSelf:'center',
        alignContent:'space-between',
        
        alignItems:'center',
        justifyContent:'center',
        //backgroundColor:'blue'
    },
    nameText:{
        fontSize:30,
        color:'black',
        textAlign:'center',
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
    nameEditButton:{
        height:40,
        width:40,
        marginLeft:10,
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
        backgroundColor:'#ebebeb',
        //width:'35%',
        padding:7.5,
        marginTop:20,
        borderRadius:10,
    },
    addButton:{
        color:'black',
        opacity:0.7,
        margin:10,
        alignSelf:'center',
        width:'30',
        //marginLeft:20,
    },
    saveButton:{
        height:40,
        width:40,
        color:'black',
        //alignSelf:'flex-start'
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

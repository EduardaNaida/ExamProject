import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Modal, Pressable, ImageBackground, Alert } from 'react-native';
import { Edit, Plus, Save, Settings, Check, ChevronUp, CornerDownLeft, UserPlus, User} from 'react-native-feather';
import { AddValueToNoteCustomId, GetPersonData, RemoveNote, RemoveValueFromNote, UpdateValueOfNote, AddNoteCustomId, SetPersonImage, UpdatePersonFields, RenameNote } from '../FirebaseInterface';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import globalStyles from '../assets/Stylesheet';
import { Platform } from 'expo-modules-core';


const PersonThumbnail = ({personData}) =>
{
    if(personData.img != '' && personData.img){
        return (
            <Image style={styles.thumbnail}
            source={{uri:personData.img}}/>
            
        );
    }

    return (
        <View style={{backgroundColor:'grey', width:70, height:70, borderRadius:35, alignItems:'center', justifyContent:'center'}}>
            <User color='white' height={50} width={50}/>
        </View>
        );
}


const Section = ({dispatch, sectionData, personId, isCreatingNew, editing}) => {
    const [visible, setVisible] = useState(false);
    const [changingName, setChangingName] = useState(false);
    const [name, setName] = useState(sectionData.headline);
    const nameInput = useRef();

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

    const renameNote = () => {
        if(!isCreatingNew)
            RenameNote(personId, sectionData.id, name);

        dispatch({type:'rename note', noteId:sectionData.id, newNoteName:name})
    }

    const submitChange = () => {
        nameInput.current?.blur();
        setChangingName(false);
        if(name != ''){
            renameNote();
            return;
        }

        setVisible(true);
    }

    return (
        <View style={styles.categoryView}> 
            <Modal visible={visible}
                transparent={true}
                onRequestClose={()=>{
                    setVisible(false);
                    setName(sectionData.headline);}}
                animationType='fade'>
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Pressable style={{position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'black', opacity:0.5}} 
                        onPress={()=>{
                            setVisible(false);
                            setName(sectionData.headline);}}/>

                    <View style={{backgroundColor:'white', borderRadius:15, padding:20}}>
                        <Text>Are you sure you want to remove {sectionData.headline}?</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:10}}>
                            <Pressable style={{margin:5, borderColor:'red', borderWidth:2, borderRadius:5, padding:5}}
                                onPress={removeNote}>
                                <Text style={{color:'red'}}>Remove</Text>
                            </Pressable>
                            <Pressable style={{margin:5, borderColor:'#ADD8E6', borderWidth:2, borderRadius:5, padding:5}}
                                onPress={()=>{
                                    setVisible(false);
                                    setName(sectionData.headline);
                                    }}>
                                <Text style={{color:'#ADD8E6'}}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.categoryContainer}>
                {
                    changingName && editing ?
                    <View style={{...styles.txtContainer, justifyContent:'center', alignItems:'center', alignSelf:'center', width:'70%', height:30, marginLeft:20}}>
                        <TextInput ref={nameInput} style={styles.inputView} value={name} onChangeText={setName} onBlur={submitChange}/>
                    </View>
                    :
                    <View style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{sectionData.headline}</Text>
                    
                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignSelf:'flex-start'}} onPress={() =>{
                        setChangingName(true);
                        setTimeout(() => nameInput.current?.focus(), 10);
                    }}>
                    {
                        editing ?
                        <ChevronUp 
                            width={20}
                            height={20}
                            color={'lightgrey'}
                            margin={10}
                            marginLeft={0}
                            alignSelf={'center'}/>
                        :
                        <></>
                    }
                    </TouchableOpacity>
                    </View>
                }
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
                <TextInput 
                ref={input} 
                onChangeText={setText} onBlur={textFinished}></TextInput>
            </View>
            :
            (
                editing ?
                <Pressable 
                    style={styles.button}
                    onPress={buttonClicked}>
                        <Plus 
                            color={'black'}
                            width={15}
                            />
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
        <Pressable style={styles.txtContainer}
            onPress={()=>{
                if(!editing)
                    return;
                setEditable(true);
                setTimeout(() => input.current.focus(), 10); 
            }}>
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
                    onPress={() => {
                        setEditable(true); 
                        console.log('hej');
                        setTimeout(() => input.current.focus(), 10);
                } }>
                    <CornerDownLeft 
                        width={20}
                        color={"lightgrey"}
                        marginLeft={-20}
                        />
                </Pressable>
                :
                <></>
            }
        
        </Pressable>
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
        case 'rename note':{
            const index = state.notes.map(x => x.id).indexOf(action.noteId);
            if(index > -1)
                state.notes[index].headline = action.newNoteName
            return {...state};
        }
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        <Text style={globalStyles.header}>{state.name}</Text>
        <KeyboardAwareScrollView borderTopLeftRadius={60} borderTopRightRadius={60}>
            
            <View style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={true}>
                    <TouchableOpacity onPress={setImage} style={{width:70, height:70, borderRadius:35, alignSelf:'center', marginTop:10}} disabled={!editing}>
                        <PersonThumbnail personData={state}/>
                    </TouchableOpacity>

                    {
                        editingName ?
                            <TextInput
                                placeholder={state.name}
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
                                            style={styles.nameEditButton} height={20} marginLeft={20} marginTop={10}/>
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
                            <TextInput style={globalStyles.txtInput} textAlign={'left'}
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
                            onPress={() => buttonClicked(input, setAdding)}><Text style={styles.buttonText}>{'Add new category'}</Text>
                        </Pressable>
                        :
                        <></> 
                    }
                    </>
                }
        </ScrollView>
    </View> 
    </KeyboardAwareScrollView>
    </View>    
    );
};

const styles = StyleSheet.create({
    header:{
        color:'white', 
        fontSize:35, 
        height:100, 
        lineHeight:120,
        alignSelf:'center', 
        textAlign:'center', 
    },
    thumbnail:{
        alignSelf:'center',
        width:70,
        height:70,
        borderRadius:35,
    },
    thumbnailText:{
        fontSize:20,
        textAlignVertical: 'center',
    },
    container:{
        padding:10,
        backgroundColor:'#ffffff',
        //flex:1,
        borderRadius:60,
        borderBottomEndRadius:0,
        borderBottomStartRadius:0,
        alignSelf:'stretch',
        height:'200%',
    }, 
    txtContainer:{
        margin:10,
        height:35,
        padding:7,
        flexDirection:'row',
        backgroundColor:'#ebebeb',   
        justifyContent:'space-between',
        alignSelf:'center',
        borderRadius:10,
        width:'90%',
    },
    inputView:{
        backgroundColor:'transparent',
        fontSize:20,
        height:25,
        width:300,
        alignSelf:'center',
        textAlign:'center',
    },
    newTitle:{
        fontSize:23,
        color:'black',
        textAlign:'left',
    },
    menuContainer:{
        flexDirection: 'row',
    },
    menuItem:{
        height:30,
    },
    menu:{
        top:-80,
        left:0, 
        position:'absolute',
        elevation:100,
        zIndex:100
    },
    categoryView:{
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
    },
    categoryContainer:{
        flexDirection:'row',
        backgroundColor:'#00000000',
        borderRadius:10,
        width:'100%',
        padding:7,
        
    },
    categoryTitle:{
        fontSize:24,
        color:'black',
        textAlign:'left',
        margin:5,
    },    
    categoryText:{
        fontSize:19,
        justifyContent:'center',
        alignSelf:'center',
        textAlign:'center',
        width:'95%',
    },
    nameContainer:{
        minWidth:150,
        maxWidth:200,
        flexDirection:'row',
        alignSelf:'center',
        alignContent:'space-between',
        alignItems:'center',
        justifyContent:'center',
    },
    nameText:{
        marginTop:13,
        fontSize:30,
        color:'black',
        textAlign:'center',
    },
    button:{
        height:22,
        width:50,
        backgroundColor:'#ADD8E6',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
    },
    nameEditButton:{
        marginLeft:10,
        color:'gray',
    },
    addCategoryStyle:{
        backgroundColor:'#ADD8E6',
        padding:6,
        alignSelf:'center',
        marginTop:30,
        borderRadius:20,
        height:30,
        width:300,
    },
    saveButton:{
        height:40,
        width:40,
        color:'white',
    },
    buttonText:{
        fontSize:17,
        alignSelf:'center',
    },
});
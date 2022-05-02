import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput, Image, ActivityIndicator, Pressable, ImageBackground } from 'react-native';
import { Edit, Trash, Delete, Plus, Save,FilePlus} from 'react-native-feather';
import { AddValueToNoteCustomId, GetPersonData, RemoveNote, RemoveValueFromNote, UpdateValueOfNote, AddNoteCustomId, SetPersonImage, UpdatePersonFields } from '../FirebaseInterface';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';


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
        </Text>);
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

    return (
        // TODO: Remove <View>
        <View style={{flexDirection:'column'}}> 
            <View style={styles.headlineContainer}>
                <Text style={styles.txtHeadline}>{sectionData.headline}</Text>
                
                <Pressable  
                    onPress={removeNote}>
                        <Trash style={styles.deleteButton}/>
                        </Pressable>
                        </View>
            {
                sectionData.values.map(note => 
                <Note 
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
        <View style={{flexDirection:'row'}}>
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
                <View style={styles.txtContainer}>
                <Text style={styles.txtValues}>{text}</Text></View>
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
            <View style={styles.buttonView}>
                <Pressable  
                    onPress={pressed}>
                    <Save style={styles.saveButton}/>
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
        return(<ActivityIndicator size='large'/>)

    //console.log(state.name);

    return (
        
        <View style={{flex:1}}>
            <ImageBackground 
                source={require('../Pages/img/header.png')}
                style={styles.image}><Text style={styles.header}>{"SociMap"}</Text>
                </ImageBackground>
            <View style={styles.container}>
            <ScrollView>
                    <TouchableOpacity onPress={setImage}>
                        <PersonThumbnail personData={state}/>
                    </TouchableOpacity>
                    <View style={{flex:1}}>
                    {
                        editingName ?
                            <TextInput
                                style={styles.txtInputView}
                                ref={nameInput}
                                onChangeText={setName}
                                onBlur={nameFinished}
                            />
                            :
                            <Text style={styles.txtName}>{state.name}</Text>
                    }
                    <View style={{flex:1}}>
                    <Pressable 
                        onPress={() => 
                        buttonClicked(nameInput, setEditingName)}>
                            <Edit
                                style={styles.nameEditButton}/>
                            </Pressable>
                            </View>
                    </View>

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
                        <TextInput 
                        ref={input} 
                        onChangeText={setText} 
                        onBlur={textFinished}></TextInput>
                    :
                        <Pressable 
                            title='Add note' 
                            onPress={() => buttonClicked(input, setAdding)}><Text style={styles.buttonText}>{'Add note'}</Text>
                            </Pressable> 
                }
        </ScrollView>
        </View>      
    </View>
    );
};

const styles = StyleSheet.create({
    // TODO: Same as in PersonsView, move to global 
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
    image:{
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
        marginBottom:'60%',
    },
    container:{
        flex: 1,
        padding:10,
        //alignItems:'center',
        backgroundColor:'#ffffff',
        width:'100%',
        height:'200%',
        top:'-40%',
        borderRadius:60,
        flexDirection:'column',
        justifyContent:'space-evenly'
        //alignItems:'center',
    }, 
    txtContainer:{
        //flex:1,
        margin:10,
        height:40,
        backgroundColor:'#FFB6C1', // TODO: The color of user-choice (from group)
        flexDirection:'column',
        justifyContent:'center',
        borderRadius:20,
        width:'80%',
    },
    txtInputView:{
        backgroundColor:'#e3e3e3',
        borderRadius:30,
        padding:5,
        height:40,
        width:220,
    },
    txtHeadline:{
        fontSize:25,
    },
    headlineContainer:{
        //backgroundColor:'lightgray',
        padding:5,
        alignSelf: 'flex-start',
        marginLeft:'10%'
    },
    txtName:{
        fontSize:30,
        color:'black',
        marginLeft:10,
        alignSelf:'center',
    },
    txtValues:{
        fontSize:20,
        textAlign:'center',
        padding:10,
    },
    // TODO: Same as in PersonsView, move to global file? 
    // START ----- 
    buttonView:{
        backgroundColor:'#ADD8E6',
        borderRadius:10,
        width:'30%',
        height:'20%',
        alignItems:'center',
        justifyContent:'center',
        //alignSelf:'center',
    },
    button:{
        height:40,
        width:40,
        color:'black',
    },
    deleteButton:{
        height:40,
        width:40,
        color:'grey',
        marginTop:'-10%',
        marginLeft:'60%',
    },
    editButton:{
        height:40,
        width:40,
        color:'gray',
        marginTop:15,
        marginLeft:-50,
    },

    addButton:{
        height:40,
        width:40,
        color:'gray',
        marginTop:0,
        marginLeft:20,
    },
    nameEditButton:{
        height:40,
        marginTop:-27,
        marginRight:'15%',
        alignSelf:'flex-end',
        width:40,
        color:'gray',
    },
    saveButton:{
        height:40,
        width:40,
        color:'black',
    },
    buttonText:{
        fontSize:20,
        backgroundColor:'lightgrey',
        width:'20%',
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
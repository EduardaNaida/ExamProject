import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput, Image, ActivityIndicator } from 'react-native';
import { Edit, Trash, Delete} from 'react-native-feather';
import { AddValueToNoteCustomId, GetPersonData, RemoveNote, RemoveValueFromNote, UpdateValueOfNote, AddNoteCustomId, SetPersonImage } from '../FirebaseInterface';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';

const PersonThumbnail = ({personData}) =>
{
    const [acro, _] = useState(() => {
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

const Section = ({dispatch, sectionData, personId}) => {
    
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
        RemoveNote(personId, sectionData.id);
        dispatch({type:'remove note', noteId:sectionData.id})
    }

    return (
        <View>
            <View style={{flexDirection:'row'}}>
                <Text>{sectionData.headline}</Text>
                <Button title='remove' onPress={removeNote}/>
            </View>
            {
                sectionData.values.map(note => <Note key={note.id} value={note} dispatch={dispatch} personId={personId} noteId={sectionData.id}></Note>)
            }
            {
                adding ?
                    <TextInput ref={input} onChangeText={setText} onBlur={textFinished}></TextInput>
                :
                    <Button title='Add value' onPress={buttonClicked}/>
            }
        </View>
    );
}

const Note = ({dispatch, value, personId, noteId}) => {
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
            RemoveValueFromNote(personId, noteId, value.id);
            dispatch({type:'remove value', noteId: noteId, valueId:value.id});
            return;
        }
        UpdateValueOfNote(personId, noteId, value.id, text);
        dispatch({type:'update value', noteId: noteId, valueId:value.id, newValue:text});
    };

    return (
        <View style={{flexDirection:'row'}}>
            {
                editable ? 
                <TextInput 
                    onFocus={() => setEditable(true)} 
                    onBlur={updateText} 
                    value={text} 
                    ref={input} 
                    onChangeText={setText}
                    multiline={true}/>
                :
                <Text>{text}</Text>
            }

            <Button onPress={() => {setEditable(true); setTimeout(() => input.current.focus(), 10);} } title='edit'></Button>
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

    console.log('params', route.params);

    const personId = route.params.personId;

 

    useEffect(()=>{
        GetPersonData(personId).then(x=>{
            dispatch({type:'init', data:x});
        })
    }, []);
    
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
            AddNoteCustomId(state.id, text, id);
            
            setText('');
            dispatch({type:'add note', note:{id:id, headline:text, values:[]}});
        }
    };

    const setImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
        });

        const uri = await SetPersonImage(state.id, result.uri);

        dispatch({type:'update img', url:uri});
    };

    if(state == null)
        return(<ActivityIndicator size='large'/>)

    return (
        <View>
            <ScrollView>
                <TouchableOpacity onPress={setImage}>
                    <PersonThumbnail personData={state}/>
                </TouchableOpacity>
                <Text>{state.name}</Text>

                {
                    state.notes.map(section => <Section key={section.id} sectionData={section} dispatch={dispatch} personId={state.id}></Section>)
                }
                
                {
                    adding ?
                        <TextInput ref={input} onChangeText={setText} onBlur={textFinished}></TextInput>
                    :
                        <Button title='Add note' onPress={buttonClicked}/>
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    
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
});
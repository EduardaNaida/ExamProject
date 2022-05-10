import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Pressable, Alert } from 'react-native';
import { Edit, Plus, Save, Settings} from 'react-native-feather';
import { AddValueToNoteCustomId, GetPersonData, RemoveNote, RemoveValueFromNote, UpdateValueOfNote, AddNoteCustomId, SetPersonImage, UpdatePersonFields } from '../FirebaseInterface';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';

import { Menu, Divider, Provider, Button } from 'react-native-paper'; 

 /** 
 *  TODO: Ändra storlek på text när man lägger till ny kategori 
 *  TODO: Ändra design på textInput
 *  TODO: Ändra kategori-titeln så den är flexDir:'row', settings-knappen bredvid 
 *  TODO: Formatera TextInput så att den öppnas i en 'alert'-liknade view och är placerad på samma ställe för alla typer av inputs 
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
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
            <View style={styles.categoryView}> 
                <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{sectionData.headline}</Text>
                    <Provider>
                        <Menu 
                            style={styles.menu}
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={
                            <TouchableOpacity style={{flexDirection:'row'}}onPress={openMenu}>
                                <Settings 
                                    width={20}
                                    alignSelf={'center'}
                                    color={'lightgrey'}/>
                                </TouchableOpacity>}>
                                    
                                        <Menu.Item style={styles.menuItem} onPress={alertMsg} title='Edit category'/>
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
                />)
            }
            
            {
                adding ?
                <View style={styles.txtContainer}>
                    <TextInput style={styles.inputView}
                    ref={input} onChangeText={setText} onBlur={textFinished}></TextInput></View>
                :
                    <Pressable 
                    style={styles.button}
                    onPress={buttonClicked}>
                        <Plus 
                            width={15}
                            height={25}
                            size={10}
                            color={"black"}/>
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
            <Pressable 
                onPress={() => {setEditable(true); 
                setTimeout(() => input.current.focus(), 10);
            } }>
                <Edit 
                    width={20}
                    alignSelf={'flex-end'}
                    color={'grey'}
                /></Pressable>
        
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

    navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        title:'',
        headerTintColor: '#fff',
      });


    const [state, dispatch] = useReducer(stateUpdater, {notes:[]});   
    const [adding, setAdding] = useState(false);
    const [text, setText] = useState('');
    const input = useRef();
    
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState('');
    const nameInput = useRef();
    
    const personId = route.params.personId;
    const isCreatingNew = route.params.isCreatingNew;

    
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
                        <Save 
                            width={30}
                            color='white'/>
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


    //console.log(state.name);

    return (
        
        <View style={{flex:1,flexDirection:'column'}}>
            <Text style={styles.header}>{"People"}</Text>
            <View style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={true}>
                    <TouchableOpacity onPress={setImage} style={styles.thumbnailImg}>
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
                            <View style={styles.thumbnailContainer}>
                                <Text style={styles.thumbnailText}>{state?.name ? state?.name : ''}</Text>
                                <Pressable 
                                    onPress={() => 
                                    buttonClicked(nameInput, setEditingName)}>
                                    <Edit
                                        marginLeft={20}
                                        width={20}
                                        color={"lightgrey"}/>
                                </Pressable>
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
                    
                        <Pressable 
                            title='Add headline' 
                            style={styles.addCategoryStyle}
                            onPress={() => buttonClicked(input, setAdding)}><Text style={styles.buttonText}>{'Add category'}</Text>
                            </Pressable> 
                            </>
                }
        </ScrollView>
        </View>        
    </View>
    );
};

const styles = StyleSheet.create({
    indicator:{
        marginTop:'50%',
    },
    header:{
        fontSize: 40,
        fontFamily:'Avenir-Medium',
        color:'#fff',
        textAlign:'center',
        alignItems:'flex-start',
        marginTop:'22%',
        height:'10%',
    },
    thumbnailContainer:{
        minWidth:'90%',
        padding:5,
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        borderBottomColor:'lightgrey',
        borderBottomWidth:1,
    },
    thumbnailImg:{
        width:70,
        height:70,
        borderRadius:35,
        alignSelf:'center',
        marginTop:10,
    },
    thumbnail:{
        width:70,
        height:70,
        borderRadius:35,
        backgroundColor:'gray',
        overflow:'hidden',
        borderWidth:1,
    },
    thumbnailText:{
        fontSize:30,
        paddingRight:'5%',
        paddingLeft:'15%',
        color:'black',
        fontFamily:'Avenir-Book',
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
    // Entries in categories
    txtContainer:{
        margin:10,
        padding:7,
        flexDirection:'row',
        backgroundColor:'#ebebeb', // TODO: The color of user-choice (from group)
        justifyContent:'center',
        alignSelf:'center',
        borderRadius:10,
        width:'90%',
    },
    inputView:{
        backgroundColor:'#00000000',
        borderBottomColor:'black',
        borderBottomWidth:1,
        fontSize:20,
        fontFamily:'Avenir-Book',
        height:30,
        //paddingLeft:15,
        width:'90%',
        alignSelf:'center',
        textAlign:'left',
    },
    newTitle:{
        fontSize:20,
        fontFamily:'Avenir-Book',
        color:'black',
        textAlign:'left',
    },
    menuItem:{
        height:30,
        fontFamily:'Avenir-Book',
    },
    menu:{
        borderRadius:10,
        top:'-160%',
        left:'60%',
        position:'absolute',
        zIndex:100,
    },
    categoryView:{
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:'5%',
    },
    categoryContainer:{
        flexDirection:'row',
        backgroundColor:'#00000000',
        borderRadius:10,
        width:'100%',
        padding:7,
        //alignSelf:'center',
        //marginTop:'5%',
        marginBottom:'-4%',
    },
    categoryTitle:{
        fontFamily:'Avenir-Book',
        fontSize:24,
        color:'black',
        textAlign:'left',
        margin:5,
        width:'90%',
    },    
    categoryText:{
        fontSize:19,
        fontFamily:'Avenir-Book',
        //justifyContent:'center',
        alignSelf:'center',
        textAlign:'center',
        width:'80%'
    },
    button:{
        width:'15%',
        backgroundColor:'#ADD8E6',
        alignItems:'center',
        borderRadius:30,
        marginTop:'2%',
    },
    addCategoryStyle:{
        backgroundColor:'#ebebeb',
        padding:7.5,
        width:'50%',
        alignSelf:'center',
        marginTop:20,
        borderRadius:10,
    },
    buttonText:{
        fontSize:22,
        alignSelf:'center',
        borderRadius:20,
        fontFamily:'Avenir-Book',
    },
});

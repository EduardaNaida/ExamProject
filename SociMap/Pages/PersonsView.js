import { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, Button, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import { Bold, Feather, Plus, Search  } from 'react-native-feather';
//import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native';
import { GetPersonsFromPath, AddNewPerson, AddPersonIdToCollection } from '../FirebaseInterface'


const globalStyle = require('../assets/Stylesheet');


const PersonThumbnail = ({personData}) =>
{
    const [acro, _] = useState(() => {
        if(!personData.name)
            return '';

        const str = personData.name;
        const matches = str.match(/\b(\w)/g);
        const acronym = matches.join('').substring(0,1); 
        return acronym;
    });
    if(personData.img != ''){
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

const PersonWidget = ({personData, navigation}) =>
{
    const navToPerson = () => {
        navigation.navigate('Person', {personId: personData.id, isCreatingNew:false})
    }

    return (
        <TouchableOpacity onPress={navToPerson}>
            
                <View style={styles.listItem}>
                    <PersonThumbnail personData={personData}/>
                    <Text style={styles.itemText}>{personData.name}</Text>
            
            </View>
        </TouchableOpacity>
    );
}

const stateUpdater = (state, action) => {
    switch (action.type) {
        case 'init':
            return {people:action.data, filtered:action.data, text:''};

        case 'add':
            const dat = action.data;
            delete dat.notes;
            const n = [...state.people, dat];
            const filt = filterPersons(state.text, n)
            //console.log(filt);
            return {...state, people:n, filtered:filt};
        case 'set text':
            return {...state, text:action.data, filtered:filterPersons(action.data, state.people)};
    
        default:
            console.log('Unkown');
            return state;
    }
}


const filterPersons = (text, arr) => {
    return (arr.filter(person => {
        const name = person.name.toLowerCase();
        return name.includes(text.toLowerCase());
    }));
};

export default PersonsView = ({navigation, route}) =>
{
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useReducer(stateUpdater, null);
    const header_name = "People";
    //const Stack = createNativeStackNavigator();
    const isFocused = useIsFocused();

    const path = route.params?.Path;

    useEffect(async ()=>{
        //console.log('fetching...')
        if(!isFocused || route.params?.Post)
            return;

        const p = path ? path : '';
        
        GetPersonsFromPath(p).then(ret => {

            dispatch({type:'init', data:ret});

            setLoading(false);
            //console.log('fetched persons')
        }).catch(err => {
            console.log(err);
            
            dispatch({type:'init', data:[]});

            setLoading(false);
        });
    }, [path, isFocused]);

    useEffect(async ()=>{
        if(!route.params?.Post)
            return;

        const obj = JSON.parse(route.params?.Post);
            
        const [id, url] = await AddNewPerson(obj);
        if(path)
            AddPersonIdToCollection(path, id);
            
        navigation.setParams({...route.params, Post:''});

        //console.log(id,url);

        const nObj = {...obj, id:id, img:url};

        setImmediate(() => dispatch({type:'add', data:nObj}));
    }, [route.params?.Post])

    const renderWidget = ({item}) =>{
        //console.log(item);

        return (<PersonWidget personData={item} navigation={navigation}/>)
    };


    return loading ?
        (<ActivityIndicator
            size='large'
            color='blue'
        />)
        :
        (  
            <View style={{flex:1}}>
                <Text style={styles.header}>{header_name}</Text>
                <View style={styles.container}>
                    <View style={styles.menuBar}>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Search'
                                value={state.text}
                                onChangeText={(text) => dispatch({ type: 'set text', data: text })} />
                            <Search style={styles.searchIcon} />
                        </View>
                        <View style={styles.buttonView}>
                            <Pressable style={styles.buttonStyle} 
                            onPress={() => {
                                navigation.navigate('Person', { isCreatingNew: true });
                            } }>
                                <Plus style={styles.addButton} />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            style={styles.listSection}
                            data={state.filtered}
                            renderItem={renderWidget}
                            keyExtractor={(_, index) => index} />
                    </View>
                </View>
            </View>
        );
}

// TODO: Changed Button to Pressable style on row 167
// <Button
//title='Add'
//style={styles.btnStyle}
//onPress={() =>{
//    navigation.navigate('Person', {isCreatingNew:true});
    //setImmediate(() => filterPersons(filterText));
//}}><Text style={styles.btnTxt}>Add</Text></Button>



const styles = StyleSheet.create({
    header:{
        marginTop: 40,
        marginBottom: 10,
        marginLeft:40,
        fontSize: 40,
        
        color:'#fff',
    },
    container:{
        alignItems:'center',
        backgroundColor:'white',
        marginLeft:0,
        borderRadius:60,
        borderBottomEndRadius:0,
        borderBottomStartRadius:0,
        flex:1,
        alignSelf:'stretch'
    },
    menuBar:{
        marginTop:20, 
        flexDirection:'row',
        justifyContent:'space-between',
    },
    inputView:{
        flex:1,
        paddingLeft:60,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignContent:'center',
    },
    textInput:{
        fontSize:20,
        backgroundColor:'#e3e3e3',
        borderColor:'#b5b5b5',
        textAlign:'center',
        borderRadius: 10,
        padding:5,
        height:35,
        width:220,
    },
    searchIcon:{
        color:'grey',
        marginLeft: -35,
        height:20,
        marginTop:6,
        alignSelf:'flex-start',
    },
    buttonView:{
        flex:1, 
    },
    addButton:{
        alignSelf:'center',
        color:'black',
        height:40,
    },
    buttonStyle:{
        width:60,
        height:35,
        borderRadius:80,
        justifyContent:'center',
        alignSelf:'center',
        backgroundColor:'#ADD8E6',
        opacity:0.8,
    },
    buttonText:{
        fontSize:15,
        padding:10,
        color:'black',
        textAlign:'center',
    },
    listSection:{
        padding:5,
        margin:10,
    },
    listItem:{
        margin: 7.5,
        padding:5,
        flexDirection: 'row',
        backgroundColor:'#D2F2CB', // TODO: background color of the items should be depending on what group+group color?
        borderRadius:10,
        width:319,
        justifyContent:'flex-start',
    },
    listContainer:{
        flex:1,
    },
    itemText:{
        fontSize:20,
        textAlign:'center',
        marginLeft:'5%',
        alignSelf:'center',
    },
    thumbnail:{
        marginLeft:'2.5%',
        backgroundColor:'#ffffff',
        width:35,
        height:35,
        opacity:0.8,
        borderRadius:35,
    },
    thumbnailText:{
        fontSize:27,
        textAlign: 'center',
    },
});

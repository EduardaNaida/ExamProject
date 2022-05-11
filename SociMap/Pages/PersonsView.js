import { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TextInput, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import { Plus, Search  } from 'react-native-feather';
//import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native';
import { GetPersonsFromPath, AddNewPerson, AddPersonIdToCollection } from '../FirebaseInterface'


// TODO: Add global stylesheet 
// const globalStyle = require('../assets/Stylesheet');

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
    const header_name = "SociMap";
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
                <Text style={styles.header}>{"SociMap"}</Text>
                <View style={styles.container}>
                    <View style={styles.menuBar}>
                        <View style={styles.textInput}>
                            <TextInput
                                theme={{colors:{primary:'transparent'}}}
                                height={20}
                                textAlign={'center'}
                                fontSize={20}
                                selectionColor={'gray'}
                                placeholder='Search'
                                value={state.text}
                                onChangeText={(text) => dispatch({ type: 'set text', data: text })}/>
                            </View>
                            <Pressable style={styles.buttonStyle} 
                            onPress={() => {
                                navigation.navigate('Person', { isCreatingNew: true });
                            } }>
                                <Plus 
                                    width={15}
                                    color={'black'}
                                    alignSelf={'center'}

                             />
                            </Pressable>
                     
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

const styles = StyleSheet.create({
    header:{
        fontSize: 40,
        fontFamily:'Avenir-Medium',
        textAlign:'center',
        //alignItems:'flex-start',
        marginTop:'22%',
        height:'10%',
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
        marginTop:'5%', 
        flexDirection:'row',
        justifyContent:'space-between',
    },
    textInput:{
        fontSize:20,
        fontFamily:'Avenir-Book',
        backgroundColor:'#e3e3e3',
        borderRadius: 10,
        padding:5,
        height:'110%',
        width:'65%',
        marginRight:'2%',
    },
    buttonStyle:{
        width:60,
        height:25,
        borderRadius:20,
        justifyContent:'center',
        alignSelf:'center',
        backgroundColor:'#ADD8E6',
        opacity:0.8,
    },
    buttonText:{
        fontSize:15,
        fontFamily:'Avenir-Book',
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
        backgroundColor:'#ebebeb', // TODO: background color of the items should be depending on what group+group color?
        borderRadius:10,
        width:319,
        justifyContent:'flex-start',
    },
    listContainer:{
        flex:1,
    },
    itemText:{
        fontSize:20,
        fontFamily:'Avenir-Book',
        textAlign:'center',
        marginLeft:'5%',
        alignSelf:'center',
    },
    thumbnail:{
        padding:5,
        backgroundColor:'#ffffff',
        width:35,
        height:35,
        opacity:0.8,
        borderRadius:18,
        overflow:'hidden',
    },
    thumbnailText:{
        fontSize:24,
        fontFamily:'Avenir-Book',
        textAlign: 'center',
    },
});

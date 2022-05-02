
import { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, Button, TouchableOpacity, Pressable, ImageBackground } from 'react-native';
import { Bold, Feather, Plus, Search  } from 'react-native-feather';
import { GetPersonsFromPath, GetUid, AddNewPerson } from '../FirebaseInterface'



async function addTemp(name){
    const obj = {
        name: name + ' testson',
        img: 'https://reactnative.dev/img/tiny_logo.png',
        color:'green',
    };
    const id = await AddNewPerson(obj);

    return ({
        id:id,
        ...obj
    });
}


const PersonThumbnail = ({personData}) =>
{
    const [acro, _] = useState(() => {
        if(!personData.name)
            return '';

        const str = personData.name;
        const matches = str.match(/\b(\w)/g);
        const acronym = matches.join('').substring(0,2); 
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
            //console.log(n);
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

export default PersonsView = ({path, navigation, route}) =>
{
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useReducer(stateUpdater, null);
    const header_name = "SociMap";

    useEffect(async ()=>{
        //console.log('fetching...')

        const p = path == null ? `Users/${GetUid()}/People` : path;
        
        GetPersonsFromPath(p).then(ret => {
            dispatch({type:'init', data:ret});

            setLoading(false);
            //console.log('fetched persons')
        }).catch(err => {
            console.log(err);
            
            dispatch({type:'init', data:[]});

            setLoading(false);
        });
    }, [path]);

    useEffect(async ()=>{
        
        if(!route.params?.Post)
            return;
        
        const obj = JSON.parse(route.params?.Post);
        
        const [id, url] = await AddNewPerson(obj);

        console.log(id,url);

        const nObj = {...obj, id:id, img:url};

        dispatch({type:'add', data:nObj});
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
        (  <ImageBackground
            source={require('./img./background.png')} 
                //'https://wallpaperaccess.com/full/1159055.png'}}
            style={styles.image}
          >
        <Text style={styles.header}>{header_name}</Text>
            <View style={styles.container}>
                <View style={styles.menuBar}>
                    <View style={styles.inputView}>
                    <TextInput
                        style={styles.textInput} 
                        placeholder='Search' 
                        value={state.text} 
                        onChangeText={(text) => dispatch({type:'set text', data:text})}/>
                        <Search style={styles.searchIcon}/>
                    </View>
                <View style={styles.buttonView}>
                <Pressable style={styles.buttonStyle} onPress={() => {
                    navigation.navigate('Person', {isCreatingNew:true});}}>
                        <Plus style={styles.addButton}/>
                            </Pressable>
                            </View>
                            </View>
                
            
            <FlatList
                style={styles.listSection}
                data={state.filtered}
                renderItem={renderWidget}
                keyExtractor={(_, index) => index}
            /></View>
   </ImageBackground >);
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
        marginTop: 80,
        marginBottom:-20,
        fontSize: 40,
        textAlign:'center',
    },
    container:{
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        //flex: 3,
        backgroundColor:'#ffffff',
        width:'100%',
        height:'70%',
        left:0,
        justifyContent:'center',
        top:60,
        borderRadius:50,
        opacity:0.85,
    },
    image:{
        flex:1, 
        width:null,
        height:null,
    },
    menuBar:{
        flex: 1, 
        marginTop:40, 
        marginBottom:-90, 
        flexDirection:'row',
        justifyContent:'space-between',
    },
    inputView:{
        flex:1,
        paddingLeft:50,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignContent:'center',
    },
    textInput:{
        fontSize:20,
        backgroundColor:'#e3e3e3',
        borderColor:'#b5b5b5',
        textAlign:'center',
        borderRadius: 10,
        padding:5,
        height:40,
        width:220,
    },
    searchIcon:{
        //padding:10,
        color:'grey',
        //position:'absolute',
        marginLeft: -35,
        height:20,
        marginTop:7.5,
        alignSelf:'flex-start',
    },
    buttonView:{
        flex:1, 
        //paddingRight:10,
    },
    addButton:{
        marginLeft:25,
        color:'black',
        height:40,
    },
    buttonStyle:{
        width:70,
        height:40,
        borderRadius:10,
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
        //position:'absolute',
        flexDirection: 'row',
        backgroundColor:'#f2caaa', // TODO: background color of the items should be depending on what group+group color?
        //padding:10,
        borderRadius:10,
        width:319,
        justifyContent:'flex-start',
//        alignSelf:'center',
    },
    itemText:{
        fontSize:20,
        //width:10,
        //textAlignVertical:'center',
        textAlign:'center',
        marginLeft:'5%',
        alignSelf:'center',

    },
    thumbnail:{
        marginLeft:'2.5%',
        width:40,
        height:40,
        padding:5,
        borderRadius:35,
    },
    thumbnailText:{
        fontSize:30,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});
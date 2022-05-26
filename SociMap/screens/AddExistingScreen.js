import { useState, useReducer, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, Text, Image, Pressable, TouchableOpacity, TextInput, FlatList } from "react-native";
import { Check, Search } from "react-native-feather";
import { GetPersonsFromPath } from "../FirebaseInterface";

const PersonThumbnail = ({personData}) =>
{
    const f = () => {
        if(!personData.name)
            return '';

        const str = personData.name;
        const matches = str.match(/\b(\w)/g);
        const acronym = matches.join('').substring(0,1); 
        return acronym;
    }
    const acro = f();

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

const PersonWidget = ({personData, dispatch, state}) =>
{
    const selected = state.selected.indexOf(personData.id) > -1;

    return (
        <TouchableOpacity onPress={() => dispatch({type:'toggle select', id:personData.id})}>
                <View style={styles.listItem}>
                    {
                        selected ?
                        <View style={{...styles.thumbnail, justifyContent:'center', alignItems:'center'}}>
                            <Check
                            style={{}}
                            color={'black'}
                            />
                        </View>
                        :
                        <PersonThumbnail personData={personData}/>
                    }
                    <Text style={styles.itemText}>{personData.name}</Text>
            
            </View>
        </TouchableOpacity>
    );
}


const stateUpdater = (state, action) => {
    switch (action.type) {
        case 'init':
            return {people:action.data, filtered:action.data, text:'', selected:[]};

        case 'add':
            const dat = action.data;
            delete dat.notes;
            const n = [...state.people, dat];
            const filt = filterPersons(state.text, n)
            //console.log(filt);
            return {...state, people:n, filtered:filt};
        case 'set text':
            return {...state, text:action.data, filtered:filterPersons(action.data, state.people)};

        case 'toggle select':
            const index = state.selected.indexOf(action.id);
            if(index == -1)
                state.selected.push(action.id);
            else
                state.selected.splice(index, 1);

            return {...state};
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

export default function AddExistingScreen ({navigation, route}){

    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useReducer(stateUpdater, null);


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            title:'',
            headerTintColor: '#fff',
          });
    }, []);

    useEffect(async ()=>{

        //console.log('fetching...')        
        GetPersonsFromPath('').then(ret => {
            var dat = ret;
            console.log(dat);
            if(route.params?.filterAway){
                const filterAway = route.params?.filterAway;
                dat = ret.filter(x => {
                    return filterAway.indexOf(x.id) == -1;
                })
            }
            console.log(dat);

            dispatch({type:'init', data:dat});

            setLoading(false);
            //console.log('fetched persons')
        }).catch(err => {
            console.log(err);
            
            dispatch({type:'init', data:[]});

            setLoading(false);
        });
    }, []);

    useEffect(()=>{
        navigation.setOptions({
            headerRight: () => SaveButton(state), 
        });
    }, [state])

    
    const [prev, _] = useState(() => {
        const routes = navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2];

        console.log(prevRoute.name);
        return prevRoute.name;
    })
    
    const SaveButton = (stat) => {
        const pressed = () => {
            console.log(prev);

            const ret = stat.people.filter(x => {
                return stat.selected.indexOf(x.id) > -1;
            })

            navigation.navigate({
                name: prev,
                params: { Add:JSON.stringify(ret) },
                merge: true,
            });
        }

        return (
            <View style={{alignSelf:'flex-end'}}>
                <Pressable  
                    onPress={pressed}>
                        
                    <Check style={styles.saveButton} color='white'/>
                        
                </Pressable>
            </View>
        );
    }

    
    const RenderWidget = ({item}) =>{
        //console.log(item);

        return (<PersonWidget personData={item} navigation={navigation} dispatch={dispatch} state={state}/>)
    };


    if(loading)
    {
        return ((<ActivityIndicator
            size='large'
            color='blue'
        />));
    }


    return (
        <View style={{flex:1}}>

            <Text style={{color:'white', fontSize:40, height:100, alignSelf:'center', textAlign:'center', textAlignVertical:'center'}}>Groups</Text>
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
                </View>

                <View style={styles.listContainer}>
                    {
                        <FlatList
                            style={styles.listSection}
                            data={state.filtered}
                            renderItem={RenderWidget}
                            keyExtractor={(_, index) => index} />
                    }
                </View>
            </View>
        </View>
    );
}


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
        alignSelf:'stretch',
    },
    menuBar:{
        marginTop:20, 
        flexDirection:'row',
        justifyContent:'space-between',
    },
    inputView:{
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width:320,
        backgroundColor:'#e3e3e3',
        borderColor:'#b5b5b5',
        textAlign:'center',
        borderRadius: 10,
        alignItems:'center'
    },
    textInput:{
        fontSize:20,
        padding:5,
        flex:1
    },
    searchIcon:{
        color:'grey',
        height:20,
        alignSelf:'center',
        marginRight:4
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
        width:320,
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

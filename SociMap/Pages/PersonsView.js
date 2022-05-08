
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, Button, TouchableOpacity } from 'react-native';
import { GetPersonsFromPath, AddNewPerson, AddPersonIdToCollection } from '../FirebaseInterface'

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
            <View style={styles.widgetContainer}>
                <PersonThumbnail personData={personData}/>
                <Text style={styles.widgetText}>{personData.name}</Text>
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
        (<View>
            <View style={{flexDirection:'row', }}>
                <TextInput 
                    style={styles.filter} 
                    placeholder='Filter' 
                    value={state.text} 
                    onChangeText={(text) => dispatch({type:'set text', data:text})}/>
                <Button
                    title='Add'
                    style='buttonStyle'
                    onPress={() =>{
                        navigation.push('Person', {isCreatingNew:true});
                        //setImmediate(() => filterPersons(filterText));
                    }}/>
            </View>
            
            <FlatList
                style={{padding:10}}
                data={state.filtered}
                renderItem={renderWidget}
                keyExtractor={(_, index) => index}
            />
        </View>);
}



const styles = StyleSheet.create({
    widgetContainer:{
        flexDirection: 'row',
        flex:1,
        marginBottom:5,
        backgroundColor:'#b5b5b5',
        padding:10,
        borderRadius:10,
    },
    widgetText:{
        fontSize:40,
        textAlignVertical:'center',
        marginLeft:10
    },
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
    filter:{
        height:70,
        fontSize:30,
        margin:10,
        borderWidth:1,
        borderColor:'#b5b5b5',
        flex:1,
        alignSelf:'stretch'
    },
    buttonStyle:{
        margin: 10,
        width:40,
        textAlignVertical:'center',
        backgroundColor: 'blue',
    }
});
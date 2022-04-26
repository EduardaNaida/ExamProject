
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, Button, TouchableOpacity } from 'react-native';
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
        console.log(personData);
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
        navigation.navigate('Person', {personId: personData.id})
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

export default PersonsView = ({path, navigation}) =>
{
    const [loading, setLoading] = useState(true);
    const [persons, setPersons] = useState(null);
    const [filterText, setFilterText] = useState("")
    const [filteredPersons, setFilteredPersons] = useState(null)

    useEffect(async ()=>{
        //console.log('fetching...')

        const p = path == null ? `Users/${GetUid()}/People` : path;
        
        GetPersonsFromPath(p).then(ret => {
            setPersons(ret);
            setFilteredPersons(ret);

            setLoading(false);
            //console.log('fetched persons')
        }).catch(err => {
            console.log(err);
            
            setPersons([]);
            setFilteredPersons([]);

            setLoading(false);
        });
    }, [path]);

    const renderWidget = ({item}) =>{
        console.log(item);

        return (<PersonWidget personData={item} navigation={navigation}/>)
    };

    const filterPersons = (text) => {
        setFilterText(text);
        setFilteredPersons(persons.filter(person => {
            const name = person.name.toLowerCase();
            return name.includes(text.toLowerCase());
        }));
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
                    value={filterText} 
                    onChangeText={filterPersons}/>
                <Button
                    title='Add'
                    style='buttonStyle'
                    onPress={async () =>{
                        setPersons([...persons, await addTemp(filterText)]);
                        //setImmediate(() => filterPersons(filterText));
                    }}/>
            </View>
            <FlatList
                style={{padding:10}}
                data={filteredPersons}
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
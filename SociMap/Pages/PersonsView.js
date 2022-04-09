
import { async } from '@firebase/util';
import React, { useState, useEffect, use } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image } from 'react-native';

async function dummy(str)
{
    await new Promise(r => setTimeout(r, 2000));
    return [
        {
            id: 1,
            name: "Lucas Berg",
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            color:'green'
        },
        {
            id: 2,
            name: "Marcus Berg",
            img: '',
            color: 'red'
        },
        {
            id: 3,
            name: "Annika Berg",
            img: 'https://reactnative.dev/img/tiny_logo.png',
            color: 'blue'
        }
    ];
}

const PersonThumbnail = ({personData}) =>
{
    const [acro, _] = useState(() => {
        const str = personData.name;
        const matches = str.match(/\b(\w)/g);
        const acronym = matches.join('').substring(0,2); 
        return acronym;
    });
    if(personData.img != ''){
        return (
            <Image style={{width:50, height:50}}
            source={{uri:personData.img}}/>
        );
    }

    return <Text style={{backgroundColor:personData.color, width:50, height:50}}>{acro}</Text>
}

const PersonWidget = ({personData}) =>
{
    return (
        <View>
            <PersonThumbnail personData={personData}/>
            <Text >{personData.name}</Text>
        </View>
    );
}

export default PersonsView = ({path}) =>
{
    const [loading, setLoading] = useState(true);
    const [persons, setPersons] = useState(null);
    const [filterText, setFilterText] = useState("")
    const [filteredPersons, setFilteredPersons] = useState(null)

    useEffect(()=>{
        dummy(path).then(ret => {
            setPersons(ret);
            filterPersons(filterText);
            
            setLoading(false);
            console.log('fetched persons')
        }).catch(err => console.log(err));
    }, [path]);
    
    const renderWidget = ({item}) =>{
        //console.log(item);

        return (<PersonWidget personData={item}/>)
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
            <TextInput 
                style={{backgroundColor:'red'}} 
                placeholder='Filter' 
                value={filterText} 
                onChangeText={filterPersons}/>
            <FlatList
                data={filteredPersons}
                renderItem={renderWidget}
                keyExtractor={item => item.id}
            />
        </View>);
}
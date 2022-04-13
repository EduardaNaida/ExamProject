
import React, { useState, useEffect, use } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Image, Button } from 'react-native';
import { GetPersonsFromPath, AttemptSignIn, GetUid, AddNewPerson } from '../FirebaseInterface'

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
        },
        {
            id: 4,
            name: "Lucas Berg",
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            color:'green'
        },
        {
            id: 5,
            name: "Marcus Berg",
            img: '',
            color: 'red'
        },
        {
            id: 6,
            name: "Annika Berg",
            img: 'https://reactnative.dev/img/tiny_logo.png',
            color: 'blue'
        },
        {
            id: 7,
            name: "Lucas Berg",
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            color:'green'
        },
        {
            id: 8,
            name: "Marcus Berg",
            img: '',
            color: 'red'
        },
        {
            id: 9,
            name: "Annika Berg",
            img: 'https://reactnative.dev/img/tiny_logo.png',
            color: 'blue'
        },
        {
            id: 10,
            name: "Lucas Berg",
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            color:'green'
        },
        {
            id: 11,
            name: "Marcus Berg",
            img: '',
            color: 'red'
        },
        {
            id: 12,
            name: "Annika Berg",
            img: 'https://reactnative.dev/img/tiny_logo.png',
            color: 'blue'
        }
    ]
}

async function addTemp(name){
    const obj = {
        name: name,
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

const PersonWidget = ({personData}) =>
{
    return (
        <View style={styles.widgetContainer}>
            <PersonThumbnail personData={personData}/>
            <Text style={styles.widgetText}>{personData.name}</Text>
        </View>
    );
}

export default Group2 = ({path}) =>
{
    const [loading, setLoading] = useState(true);
    const [persons, setPersons] = useState(null);
    const [filterText, setFilterText] = useState("")
    const [filteredPersons, setFilteredPersons] = useState(null)
    const [data, setData] = React.useState({
        group: [
               {'name': 'Biltema', 'color': 'blue', 'description': 'Personer jag har jobbat med på biltema', 'id': 1},
            ],
        subgroups: [
          {'name': 'Kök', 'color': 'red', 'id': 1},
          {'name': 'Lager', 'color': 'blue','id': 2},
        ],
        people: [
          {'name': 'Peter', 'color': 'red', 'id': 1},
          {'name': 'Magdalena', 'color': 'blue','id': 2},
          {'name': 'Babsan', 'color': 'grey','id': 3},
        ]
    });

    useEffect(async ()=>{
        console.log('fetching...')

        //TODO REMOVE THE FOLLOWING ROW!!!!
        console.log(await AttemptSignIn("test@test.com", "test123"));

        const p = path == null ? `Users/${GetUid()}/People` : path;
        
        GetPersonsFromPath(p).then(ret => {
            setPersons(ret);
            setFilteredPersons(ret);

            setLoading(false);
            console.log('fetched persons')
        }).catch(err => {
            console.log(err);
            
            setPersons([]);
            setFilteredPersons([]);

            setLoading(false);
        });
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
        (<View>{
            data.group.map(item => (
                <View> 
            <View style={{height: 50,
        width: '100%',
        backgroundColor: item.color}}>
        <Text style={styles.titleText}>{item.name}</Text>
        </View>
        <View style={styles.description}>
        <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
        </View>
        ))
    } 
        <View style={styles.circleContainer}>
               {
                  data.subgroups.map((item, index) => (
                     <View> 
                     <TouchableOpacity key = {item.id} style = {{
                     flexDirection: 'row',
                     backgroundColor: item.color,
                     width: 100,
                     height: 100,
                     borderRadius: 50, 
                     margin: 20,
                     justifyContent: 'space-evenly'}}>
                        <Text style={styles.groupName}>{item.name}</Text>
                    </TouchableOpacity>
                
                       </View>
                  ))
               } 
                       </View>
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
    container: {
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        marginLeft: 20,
      },
      title: {
        height: 50,
        width: '100%',
        backgroundColor: 'yellow',
      },
      titleText: {
          fontSize: 30,
          textAlign: 'left',
          color: 'white',
          marginLeft: 10
        },
        description: {
            height: 'auto',
            width: '100%',
            backgroundColor: 'grey',
          },
          descriptionText: {
            fontSize: 20,
            textAlign: 'left',
            color: 'white',
            marginLeft: 10
          },
      circleContainer: {
      flexWrap: 'wrap',
      backgroundColor: '#fff',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      flexDirection: 'row',
      margin: 20,
      },
  
      circle: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        borderRadius: 50, 
        justifyContent: 'space-evenly',
      },
      groupName: {
        flexWrap: 'wrap',
        color: 'white',
        fontSize: 20,
        marginTop: 35,
      },

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
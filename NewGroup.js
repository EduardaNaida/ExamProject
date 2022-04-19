import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList} from 'react-native';
import { Edit, Trash, X, Plus, Save } from 'react-native-feather';
import { ColorPicker} from  'react-native-status-color-picker';
import { GetPersonsFromPath, AttemptSignIn, GetUid, AddNewPerson } from '../../FirebaseInterface'


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

function EditPersonScreen(path){
    const [text,setText] = useState('');
    const [filteredPersons, setFilteredPersons] = useState(null);
    const [persons, setPersons] = useState(null);

    
    var colors = ["#F44336", "#E91E63", "#9C27B0", "#3F51B5", "#03A9F4", "#009688", "#4CAF50", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#795548", "#9E9E9E", "#607D8B"];
    var selectedColor = '#F44336';
      
    // TODO: Fetch data from AddPerson 
    var pageTitle = "New Group ";
    var categories = ["Groupname:", "Description:", "Color:", "Add people:"];
    // TODO: Used for allContacts to sort contacts alphabetically, to simplify categorization
    // when viewing list of persons 
    //alphabeticalOrder = personName.charAt(0);
    
    function renderText(array) {
        return array.map(obj => {
          return <Text>family</Text>
        });
      }
    // TODO: Family relation variable should be dynamic, find entries in the dictionary 
    function onSelect(){    
        color => this.setState({ selectedColor: color }); 
    } 

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

    return (
        <View>
        <ScrollView>

        <Text style={styles.pageHeader}>{pageTitle}</Text>
        
        <Text style={styles.editHeader}>{categories[0]}</Text>
        <TextInput 
          style={styles.input}
          onSubmitEditing={(value) => setText(value.nativeEvent.text)}/>
          
        <Text style={styles.editHeader}>{categories[1]}</Text>
        <TextInput 
          style={styles.input}
          value={text}/>
        <Text style={styles.editHeader}>{categories[2]}</Text>
        <ScrollView horizontal={true}>
        <ColorPicker
          colors={colors}
          selectedColor={selectedColor}
          onSelect={onSelect}
        />
        </ScrollView>


        </ScrollView>
        <Text style={styles.editHeader}>{categories[3]}</Text>
        <FlatList
                style={{padding:10}}
                data={filteredPersons}
                renderItem={renderWidget}
                keyExtractor={(_, index) => index}
            />
        <View style={styles.btnContainer}>    
        <TouchableOpacity style={styles.btn}>
            <Trash 
                // TODO: OnPress ==> Are you sure, if yes ==> Go back, otherwise Nothing
                name = 'trash'
                color = 'black'
                alignSelf = 'center'
            /></TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
            <Save 
                // TODO: OnPress ==> Are you sure, if yes ==> Save, otherwise Nothing
                name = 'save'
                color = 'black'
                alignSelf = 'center'
            />
            </TouchableOpacity></View> 
        </View>
        // TODO: For TextInput: onSubmitEditing={(value) => setName(value.nativeEvent.text)} 
        // When a user submits the changes instead of changetextr
    
    // TODO: Check variable names and structure 
    // TODO: If category empty ==> hide category
    // TODO: Add for-loop to generate categoryContainers  
    );
};   
export default EditPersonScreen;

const styles = StyleSheet.create({
    circleContainer: {
        flexWrap: 'wrap',
        },
    pageHeader: {
        marginTop: 10,
        flex: 0,
        padding:10,
        textAlign: 'center',
        fontSize: 30,
        alignSelf:'center',
    },
    editHeader: {
        fontSize: 22,
        padding: 5,
    },
    subEditHeader: {
        fontSize: 20,
        padding: 3, 
    },
    btn: {
        marginTop:50,
        borderRadius: 20,
        backgroundColor: "#c97ba1",
        padding: 10,
        width: "20%"
    },
    btnContainer: {
        flexDirection: 'row-reverse',
        //justifyContent: "flex-end",
        width: "100%",
    },
    input: {
        margin: 15,
        padding:10,
        borderColor: "#000000",
        borderWidth: 1
    }
  });
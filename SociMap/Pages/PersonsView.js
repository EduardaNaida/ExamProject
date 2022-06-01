import { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, Button, TouchableOpacity, Pressable, ImageBackground, Modal, StatusBar } from 'react-native';
import { Bold, Feather, Plus, Search, UserPlus } from 'react-native-feather';
//import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native';
import { GetPersonsFromPath, AddNewPerson, AddPersonIdToCollection, RemovePersonFromCollection, AddNewPersonCustomId } from '../FirebaseInterface'
import uuid from 'react-native-uuid';
import globalStyles from '../assets/Stylesheet';

const PersonThumbnail = ({ personData }) => {
    const f = () => {
        if (!personData.name)
            return '';

        const str = personData.name;
        const matches = str.match(/\b(\w)/g);
        const acronym = matches.join('').substring(0, 1);
        return acronym;
    }
    const acro = f();

    if (personData.img != '') {
        return (
            <Image style={styles.thumbnail}
                source={{ uri: personData.img }} />
        );
    }

    return (<Text style={{
        backgroundColor: personData.color,
        ...styles.thumbnail,
        ...styles.thumbnailText
    }}>
        {acro}
    </Text>);
}

const PersonWidget = ({ personData, navigation, dispatch }) => {
    const navToPerson = () => {
        navigation.navigate('Person', { personId: personData.id, isCreatingNew: false })
    }

    return (
        <TouchableOpacity onPress={navToPerson} onLongPress={() => dispatch({ type: 'select', data: { name: personData.name, id: personData.id } })}>

            <View style={styles.listItem}>
                <PersonThumbnail personData={personData} />
                <Text style={styles.itemText}>{personData.name}</Text>

            </View>
        </TouchableOpacity>
    );
}

const stateUpdater = (state, action) => {
    switch (action.type) {
        case 'init':
            let p = [];
            if(!action.data)
                p = action.data;
            return { people: action.data, filtered: action.data, text: '', selected: null };

        case 'add':
            const dat = action.data;
            delete dat.notes;
            const n = [...state.people, dat];
            const filt = filterPersons(state.text, n)
            //console.log(filt);
            return { ...state, people: n, filtered: filt };
        case 'set text':
            return { ...state, text: action.data, filtered: filterPersons(action.data, state.people) };

        case 'deselect':
            return { ...state, selected: null }

        case 'select':
            return { ...state, selected: action.data }

        case 'remove':
            const pep = state.people.filter(p => p.id != action.id);
            const fi = state.filtered.filter(p => p.id != action.id);
            return { ...state, people: pep, filtered: fi, selected: null };

        case 'update url':
            const index = state.people.map((e) => { return e.id; }).indexOf(action.id);
            const index2 = state.filtered.map((e) => { return e.id; }).indexOf(action.id);
            if (index > -1)
                state.people[index].url = action.url;
            if (index2 > -1)
                state.filtered[index2].url = action.url;

            return { ...state };

        case 'add group':
            const newArr = [];
            if(state?.people)
                newArr.concat(state.people);
            if(action?.data)
                newArr.concat(action.data);

            const newFilt = filterPersons(state.text, newArr);

            return { ...state, people: newArr, filtered: newFilt };

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

export default PersonsView = ({ navigation, route, isChild }) => {
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useReducer(stateUpdater, null);
    const header_name = "People";
    //const Stack = createNativeStackNavigator();
    const isFocused = useIsFocused();

    const path = route.params?.Path ? route.params.Path : '';
    const child = isChild == true;

    useEffect(async () => {
        //console.log('fetching...')
        if (!isFocused || route.params?.Post)
            return;

        const p = path ? path : '';

        GetPersonsFromPath(p).then(ret => {

            dispatch({ type: 'init', data: ret });

            setLoading(false);
            //console.log('fetched persons')
        }).catch(err => {
            console.log(err);

            dispatch({ type: 'init', data: [] });

            setLoading(false);
        });
    }, [path, isFocused]);

    useEffect(async () => {
        if (!route.params?.Post)
            return;

        const obj = JSON.parse(route.params?.Post);


        const id = uuid.v4();

        const nObj = { ...obj, id: id };
        setImmediate(() => dispatch({ type: 'add', data: nObj }));

        const [_, url] = await AddNewPersonCustomId(obj, id);

        setImmediate(() => dispatch({ type: 'update url', target: id, url: url }));

        if (path)
            AddPersonIdToCollection(path, id);

        navigation.setParams({ ...route.params, Post: '' });

        //console.log(id,url);

    }, [route.params?.Post])

    useEffect(() => {
        if (!route.params?.Add)
            return;

        if (!path)
            return;

        const toAdd = JSON.parse(route.params?.Add);


        console.log(toAdd);

        for (let index = 0; index < toAdd.length; index++) {
            const element = toAdd[index];

            AddPersonIdToCollection(path, element.id);
        }
        route.params.Add = '';
        dispatch({ type: 'add group', data: toAdd });
    }, [route.params?.Add]);

    const RenderWidget = ({ item }) => {
        //console.log(item);

        return (<PersonWidget personData={item} navigation={navigation} dispatch={dispatch} />)
    };

    const RemovePersonFromCol = (id) => {
        dispatch({ type: 'remove', id: id });
        RemovePersonFromCollection(path, id);
    };

    const addPerson = () => {
        if (!child) {
            navigation.navigate('Person', { isCreatingNew: true });
            return;
        }

        setAdding(true);
    }


    return loading ?
        (<ActivityIndicator
            size='large'
            color='grey'
        />)
        :
        (
            <View style={{ flex: 1 }}>
                <Modal visible={state.selected != null}
                    transparent={true}
                    onRequestClose={() => { dispatch({ type: 'deselect' }) }}
                    animationType='fade'>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', opacity: 0.5 }}
                            onPress={() => { dispatch({ type: 'deselect' }) }} />

                        <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 20 }}>
                            <Text>Are you sure you want to remove {state.selected?.name}?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                                <Pressable style={{ margin: 5, borderColor: 'red', borderWidth: 2, borderRadius: 5, padding: 5 }}
                                    onPress={() => RemovePersonFromCol(state.selected.id)}>
                                    <Text style={{ color: 'red' }}>Remove</Text>
                                </Pressable>
                                <Pressable style={{ margin: 5, borderColor: '#ADD8E6', borderWidth: 2, borderRadius: 5, padding: 5 }}
                                    onPress={() => { dispatch({ type: 'deselect' }) }}>
                                    <Text style={{ color: '#ADD8E6' }}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                </Modal>
                <Modal visible={adding}
                    transparent={true}
                    onRequestClose={() => { setAdding(false) }}
                    animationType='fade'>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', opacity: 0.5 }}
                            onPress={() => { setAdding(false) }} />

                        <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 20, maxWidth: 300 }}>
                            <Text>Do you want to create a new Person or add an existing?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                                <Pressable style={{ margin: 5, borderColor: '#ADD8E6', borderWidth: 2, borderRadius: 5, padding: 5 }}
                                    onPress={() => {
                                        setAdding(false);
                                        navigation.navigate('Person', { isCreatingNew: true });
                                    }}>
                                    <Text style={{ color: '#ADD8E6' }}>New</Text>
                                </Pressable>
                                <Pressable style={{ margin: 5, borderColor: '#ADD8E6', borderWidth: 2, borderRadius: 5, padding: 5 }}
                                    onPress={() => {
                                        setAdding(false);
                                        navigation.navigate('AddExistingPerson', { filterAway: state.people.map(x => x.id) });
                                    }}>
                                    <Text style={{ color: '#ADD8E6' }}>Existing</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                </Modal>
                {
                    child ?
                        <></>
                        :
                        <Text style={globalStyles.header}>People</Text>
                }
                <View style={styles.container}>
                    <View style={styles.menuBar}>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Search'
                                value={state.text}
                                onChangeText={(text) => dispatch({ type: 'set text', data: text })} />
                            <Search style={styles.searchButton} height={20} alignSelf={'center'} />
                        </View>
                        <View style={styles.buttonView}>
                            <Pressable style={styles.buttonStyle}
                                onPress={addPerson}>
                                <UserPlus style={styles.addButton} height={20} alignSelf={'center'} marginLeft={5} />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.listContainer}>
                        {
                            child ?
                                <View style={styles.listSection}>
                                    {
                                        state.filtered.map((x) => <RenderWidget item={x} key={x.id} />)
                                    }
                                </View>
                                :
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
    header: {
        color: 'white',
        fontSize: 35,
        height: 100,
        lineHeight: 120,
        alignSelf: 'center',
        textAlign: 'center',
    },
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginLeft: 0,
        borderRadius: 60,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        flex: 1,
        alignSelf: 'stretch'
    },
    menuBar: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputView: {
        flex: 1,
        paddingLeft: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignContent: 'center',
    },
    textInput: {
        fontSize: 20,
        backgroundColor: '#e3e3e3',
        borderColor: '#b5b5b5',
        textAlign: 'center',
        borderRadius: 20,
        padding: 5,
        height: 30,
        width: '140%',
    },
    searchButton: {
        color: 'grey',
        marginLeft: -30,
    },
    buttonView: {
        flex: 1,
    },
    addButton: {
        alignSelf: 'center',
        color: 'black',
        height: 25,
    },
    buttonStyle: {
        width: 70,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#ADD8E6',
        opacity: 1,
    },
    buttonText: {
        fontSize: 15,
        padding: 10,
        color: 'black',
        textAlign: 'center',
    },
    listSection: {
        padding: 5,
        margin: 10,
    },
    listItem: {
        margin: 7.5,
        padding: 3,
        flexDirection: 'row',
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        width: 319,
        justifyContent: 'flex-start',
    },
    listContainer: {
        flex: 1,
    },
    itemText: {
        fontSize: 20,
        textAlign: 'center',
        marginLeft: '5%',
        alignSelf: 'center',
    },
    thumbnail: {
        //marginLeft:'2.5%',
        backgroundColor: '#ffffff',
        width: 35,
        height: 35,
        opacity: 0.8,
        borderRadius: 18,
        overflow: 'hidden',
    },
    thumbnailText: {
        lineHeight: 35,
        fontSize: 22,
        textAlign: 'center',
        alignSelf: 'center',
    },
});
import { useEffect, useReducer, useState } from "react";
import { ActivityIndicator, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, FlatList } from "react-native";
import { AddGroupCustomId, GetGroups, RemoveGroup } from "../FirebaseInterface";
import uuid from 'react-native-uuid';

const GroupStateHandler = (state, action) => {
    switch (action.type) {
        case 'init':
            return action.data;
        case 'add group':
            return [...state, action.data];
        case 'remove':
            const index = state.map(x => x.id).indexOf(action.id);
            state.splice(index, 1);
            return [...state];
        default:
            break;
    }
}

export default GroupView = ({route, navigation}) => {
    const [state, dispatch] = useReducer(GroupStateHandler, null);
    const [selected, setSelected] = useState(null);

    //console.log(route.params);
    const path = route.params?.Path ? route.params.Path : '';
    console.log('path:', path);

    useEffect(async () => {
        const groups = await GetGroups(path);
        dispatch({type:'init', data:groups})
    }, [path])

    useEffect(async () => {
        if(!route.params?.PostGroup)
            return;

        const id = uuid.v4();
        const dat = {...route.params.PostGroup, id:id};

        console.log(path);
        AddGroupCustomId(path, route.params.PostGroup, id);

        navigation.setParams({...route.params, PostGroup:null});

        dispatch({type:'add group', data:dat});
    }, [route.params?.PostGroup]);

    useEffect(() => {
        if(!route.params?.Title)
            return;

        navigation.setOptions({title:route.params.Title});
    }, [route.params?.Title])

    const navDeeper = (groupId, title) => {
        console.log('current path:', path);
        const newPath = `${path}/Groups/${groupId}`;
        console.log('new path', newPath);
        const params = {...route.params, Path:newPath, Title:title};
        console.log(params);
        navigation.push('SubView', params);
    }

    const RemoveGroupFromCol = (id) => {
        dispatch({type:'remove', id:id});
        RemoveGroup(path, id);
        setSelected(null);
    }

    if(state == null)
        return <ActivityIndicator size='large' color='grey'/>

    return (
        <View> 
            <Modal visible={selected != null}
                transparent={true}
                onRequestClose={()=>{setSelected(null)}}
                animationType='fade'>
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Pressable style={{position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'black', opacity:0.5}} 
                        onPress={()=>{setSelected(null)}}/>

                    <View style={{backgroundColor:'white', borderRadius:15, padding:20}}>
                        <Text>Are you sure you want to remove {selected?.name}?</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:10}}>
                            <Pressable style={{margin:5, borderColor:'red', borderWidth:2, borderRadius:5, padding:5}}
                                onPress={() => RemoveGroupFromCol(selected.id)}>
                                <Text style={{color:'red'}}>Remove</Text>
                            </Pressable>
                            <Pressable style={{margin:5, borderColor:'#ADD8E6', borderWidth:2, borderRadius:5, padding:5}}
                                onPress={()=>{setSelected(null)}}>
                                <Text style={{color:'#ADD8E6'}}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </Modal>
            <Pressable style={styles.userBtn} 
                onPress={() => navigation.navigate('NewGroup')}>
                <Text style={styles.infoBtn}>Add new group</Text>
            </Pressable>

            <View style={styles.groupContainer}>
            {
                state.map(
                    x => 
                    <TouchableOpacity key={x.id} onPress={() => navDeeper(x.id, x.name)} onLongPress={() => setSelected(x)}>
                        <View style={{...styles.groupCircle, backgroundColor:x.color}}>
                        </View>
                        <Text style={styles.groupName}>
                            {x.name}
                        </Text>
                    </TouchableOpacity>
                )
            }
            
            </View>
        </View>
    );
}

const size = 100;

const styles = StyleSheet.create({
    txtSet:{
        fontSize: 20,
        textAlign: 'center',
        margin: 30,
        color: 'white',
    },
    infoBtn:{
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: '#000000',
    },
    userBtn:{
        width:'70%',
        maxWidth:'70%',
        alignSelf:'center',
        marginTop: 20,
        backgroundColor:'#ADD8E6', 
        borderRadius: 15,
        padding:5,
        opacity: 1,
    },
    groupContainer:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-between',
        color: 'black',
        width: 300,
        marginLeft: 30,
    },
    groupCircle:{
        textAlign: 'center',
        height: 50,
        width: 50,
        borderRadius: 30,
        marginLeft: 30,
        marginTop: 30,

    },
    groupName:{
       // marginLeft: 30,
        //marginRight: 30,
        marginLeft: 30,
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    }
    
})
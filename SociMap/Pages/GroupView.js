import { useEffect, useReducer, useState } from "react";
import { ActivityIndicator, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddGroupCustomId, GetGroups } from "../FirebaseInterface";
import uuid from 'react-native-uuid';

const GroupStateHandler = (state, action) => {
    switch (action.type) {
        case 'init':
            return action.data;
        case 'add group':
            return [...state, action.data]
        default:
            break;
    }
}

export default GroupView = ({route, navigation}) => {
    const [state, dispatch] = useReducer(GroupStateHandler, null);

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

    if(state == null)
        return <ActivityIndicator size='large'/>

    return (
        <View>
            <Button title="Add" onPress={() => navigation.navigate('NewGroup')}></Button>
            <View style={styles.groupContainer}>
                {
                    state.map(x => 
                        <TouchableOpacity key={x.id} onPress={() => navDeeper(x.id, x.name)}>
                            <View style={{...styles.groupCircle, backgroundColor:x.color}}>

                            </View>
                            <Text>
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
    groupContainer:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-evenly'
    },
    groupCircle:{
        height:size,
        width:size,
        borderRadius:size/2,
    }
})
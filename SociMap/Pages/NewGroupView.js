import { useEffect, useReducer, useState } from "react";
import { TextInput, View, Button, StyleSheet } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

const handleChange = (state, action) => {
    switch (action.type) {
        case 'change color':
            return {...state, color:action.color};
        case 'change name':
            return {...state, name:action.name};
    
        default:
            return state;
    }
}

export default NewGroupView = ({route, navigation}) => {
    const [state, dispatch] = useReducer(handleChange, {name:'', color:'red'});

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
            //console.log(stat);
            if(!stat?.name){
                alert('No name!');
                navigation.pop();
                return;
            }

            navigation.navigate({
                name: prev,
                params: { PostGroup: (stat) },
                merge: true,
            });
        }

        return (
            <Button style={styles.save} title='Save' onPress={pressed}/>
        );
    }

    //console.log(state);

    return (
        <View style={styles.filter}>
            <View style={styles.inputFilter} >
                <TextInput 
                placeholder="Enter group name"
                placeholderTextColor = "black"
                autoCapitalize = "none"
                style={styles.txtInput}
                value={state.name}
                onChangeText={(t) => dispatch({type:'change name', name:t})}/>
            </View>
            <ColorPicker style={styles.colorPicker}
                onColorChangeComplete={(c) => dispatch({type:'change color', color:c})}
                thumbSize={30}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    filter:{
        width: 300,
        alignSelf:'center',
    },
    inputFilter:{
        marginTop: 110,
        marginLeft: 30,
        marginRight: 30,
        height: 33,
        backgroundColor: 'white',
        //backgroundColor: 'rgba(65, 105, 225, 0.7)',
        borderRadius: 20,
    },
    txtInput: {
        color: 'black',
        alignSelf:'center',
        fontSize: 16,
        marginTop: 5,
      },
    colorPicker:{
        marginTop: 50,
    },
    save: {
        marginTop: 30 ,
        color: 'black'
    }
})
import { useEffect, useReducer, useState } from "react";
import { TextInput, View, Button } from "react-native";
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
            <Button title='Save' onPress={pressed}/>
        );
    }

    //console.log(state);

    return (
        <View style={{width:300, alignSelf:'center'}}>
            <TextInput value={state.name} onChangeText={(t) => dispatch({type:'change name', name:t})}/>
            <ColorPicker
                onColorChangeComplete={(c) => dispatch({type:'change color', color:c})}
                thumbSize={30}
            />
        </View>
    );
}
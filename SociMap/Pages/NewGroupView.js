import { useEffect, useReducer, useRef, useState } from "react";
import { TextInput, View, Button, StyleSheet, Pressable, Text } from "react-native";
import { Save } from "react-native-feather";
import ColorPicker from "react-native-wheel-color-picker";

import globalStyles from '../assets/Stylesheet';

const handleChange = (state, action) => {
    switch (action.type) {
        case 'change color':
            return { ...state, color: action.color };
        case 'change name':
            return { ...state, name: action.name };

        default:
            return state;
    }
}

export default NewGroupView = ({ route, navigation }) => {
    const [state, dispatch] = useReducer(handleChange, { name: '', color: 'red' });

    useEffect(() => {
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
            if (!stat?.name) {
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
            <View style={{ alignSelf: 'flex-end' }}>
                <Pressable
                    onPress={pressed}>

                    <Save style={styles.saveButton} color='white' />

                </Pressable>
            </View>
        );
    }

    const ref = useRef();
    //console.log(state);

    return (
        <View style={{ flex: 1 }}>
            <Text style={globalStyles.header}>Create new group</Text>
            <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white', borderTopLeftRadius: 60, borderTopRightRadius: 60 }}>
                <View style={styles.filter}>
                    <Pressable onPress={() => ref.current.isFocused() ? ref.current.blur() : ref.current.focus()}>
                        <TextInput
                            ref={ref}
                            placeholder="Enter group name"
                            autoCapitalize="none"
                            style={globalStyles.txtInput}
                            value={state.name}
                            onChangeText={(t) => dispatch({ type: 'change name', name: t })} />
                    </Pressable>
                    <ColorPicker style={styles.colorPicker}
                        onColorChangeComplete={(c) => dispatch({ type: 'change color', color: c })}
                        thumbSize={30}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filter: {
        marginTop: 40,
        width: 300,
        alignSelf: 'center',
    },
    inputFilter: {
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        height: 33,
        backgroundColor: 'white',
        //backgroundColor: 'rgba(65, 105, 225, 0.7)',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'black'
    },
    textInput: {
        alignSelf: 'center',
        height: '100%',
        color: 'black',
        fontSize: 16,
        textAlign: 'center'
    },
    colorPicker: {
        marginTop: 10,
    },
    save: {
        marginTop: 30,
        color: 'black'
    }
})
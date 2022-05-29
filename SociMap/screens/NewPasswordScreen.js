import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableHighlight } from "react-native";
import { SetNewPassword } from "../FirebaseInterface";
import globalStyles from '../assets/Stylesheet';

export default function NewPasswordScreen({ navigation }) {
    const [current, setCurrent] = useState('');
    const [newP, setNewP] = useState('');

    const setPassword = async () => {
        /*switch (await SetNewPassword(current, newP)) {
            case 'sucess':
                navigation.pop();
                break;
            case 'incorrect':
                alert('Incorrect Password');
                break;
            case 'invalid':
                alert('Invalid Password');
                break;
            default:
                alert('Unkown error');
                break;
        }*/
        try {
            await SetNewPassword(current, newP);
            navigation.pop();
        }
        catch (err) {
            alert(err);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Text style={globalStyles.header}>Change password</Text>
            <View style={styles.info}>
                <Text style={styles.txt}>
                    Current password:
                </Text>

                <View style={styles.inputFilter}>
                    <TextInput style={globalStyles.txtInput}
                        placeholder="******"
                        value={current}
                        textAlign={'center'}
                        onChangeText={setCurrent}
                        textContentType='password'
                        secureTextEntry={true} />
                </View>

                <Text style={styles.txt} >
                    New password:
                </Text>
                <View style={styles.inputFilter}>
                    <TextInput
                        placeholder="******"
                        style={globalStyles.txtInput}
                        textAlign={'center'}
                        value={newP} onChangeText={setNewP}
                        textContentType='newPassword'
                        secureTextEntry={true} />
                </View>
                <TouchableHighlight style={styles.btnNew} onPress={setPassword}>
                    <Text style={styles.btnText}>Confirm</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        display: 'flex',
        backgroundColor: 'transparent',
    },
    txtChange: {
        fontSize: 35,
        textAlign: 'center',
        marginTop: 15,
        width: '100%',
        color: 'white',
    },
    info: {
        flex: 1,
        width: '100%',
        alignSelf: 'stretch',
        backgroundColor: 'white',
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70
    },
    txt: {
        color: 'black',
        //        alignSelf:'center',
        textAlign: 'center',
        fontSize: 22,
        marginTop: 30,
    },
    inputFilter: {
    },
    btnNew: {
        height: 30,
        marginTop: 30,
        backgroundColor: '#ADD8E6',
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        width: 200,
    },
    btnText: {
        color: 'black',
        fontSize: 17,
        alignSelf: 'center',
    },
})
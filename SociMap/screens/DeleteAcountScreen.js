import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { deleteAcount, SetNewPassword } from "../FirebaseInterface";
import globalStyles from '../assets/Stylesheet';

export default function DeleteAcountScreen({ navigation }) {
    const [current, setCurrent] = useState('');

    const confirm = async () => {
        try{
            await deleteAcount(current);
        }
        catch (err){
            alert(err);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={globalStyles.header}>Delete Acount</Text>
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
                <TouchableOpacity style={styles.btnNew} onPress={confirm}>
                    <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>
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
import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SetNewPassword } from "../FirebaseInterface";


export default function NewPasswordScreen({navigation}){
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
        try{
            await SetNewPassword(current, newP);
            navigation.pop();
        }
        catch(err){
            alert(err);
        }
    };

    return (
        <View style={{flex:1}}>
        <Text style={{color:'white', fontSize:40, height:150, alignSelf:'center', textAlign:'center', textAlignVertical:'center'}}>Change Password</Text>
            <View style={styles.info}>
                <Text style={styles.txt}>
                        Current Password:
                        </Text>

                <View style={styles.inputFilter}>
                    <TextInput style={styles.txtInput}
                    placeholder=""
                    value={current} onChangeText={setCurrent}
                    textContentType='password'
                    secureTextEntry={true}/>
                </View>

                <Text style={styles.txt} >
                        New Password:
                        </Text>
                <View style={styles.inputFilter}>           
                    <TextInput 
                    style={styles.txtInput}
                    value={newP} onChangeText={setNewP}
                    textContentType='newPassword'
                    secureTextEntry={true}/>
                </View>
                <TouchableHighlight style={styles.btnNew} onPress={setPassword}>
                    <Text style={{width:'100%', height:'100%', textAlign:'center', textAlignVertical:'center', color:'white'}}>Confirm</Text>
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
      txtChange:{
        fontSize: 35,
        textAlign: 'center',
        marginTop: 15,
        width: '100%',
        color: 'white',
      },
    info:{
        flex:1,
        width: '100%',
        alignSelf:'stretch',
        backgroundColor: 'white',
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70
      },
    txt:{
        color: 'black',
        alignSelf:'center',
        fontSize: 16,
        marginTop: 40,
    },
    inputFilter:{
    },
    txtInput: {
        color: 'black',
        fontSize: 16,
        width:250,
        backgroundColor: 'rgba(186, 183, 183, 0.47)',
        borderRadius: 20,
        alignSelf:'center',
        padding:2,
        paddingHorizontal:10
      },
    btnNew:{
        height: 36,
        marginTop: 30,
        backgroundColor: 'rgba(65, 105, 225, 0.7)',
        borderRadius: 20,
        width: '35%',
        alignSelf:'center',
        overflow: 'hidden'
      },
})
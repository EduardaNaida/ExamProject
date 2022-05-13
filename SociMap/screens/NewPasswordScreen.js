import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
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
        <View style={styles.container}>
            <View style={styles.welcome}>
             <Text style={styles.txtChange}>Change password</Text>
            </View>
        <View style={styles.info}>
            <Text style={styles.txt}>
                       Current Password:
                    </Text>

            <View style={styles.inputFilter}>
                 <TextInput style={styles.txtInput}
                 placeholder=""
                 value={current} onChangeText={setCurrent}></TextInput>
            </View>

             <Text style={styles.txt} >
                    New Password:
                    </Text>
            <View style={styles.inputFilter}>           
                 <TextInput 
                 style={styles.txtInput}
                 value={newP} onChangeText={setNewP}></TextInput>
            </View>
            <View style={styles.btnNew}>   
                <Button 
                color={'white'} 
                title="Confirm" onPress={setPassword}></Button>
            </View>
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
      welcome: {
        margin: 50,
      },
    info:{
        display: 'flex',
        width: '100%',
        height: '100%',
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
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        height: 33,
        backgroundColor: 'rgba(186, 183, 183, 0.47)',
        borderRadius: 20,
    },
    txtInput: {
        color: 'black',
        fontSize: 16,
        marginTop: 5,
        width:'100%',
        marginLeft: 10,
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
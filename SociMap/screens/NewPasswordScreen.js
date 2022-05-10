import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
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
        <View>
            <Text>
                Current Password:
            </Text>
            <TextInput value={current} onChangeText={setCurrent}></TextInput>
            <Text>
                New Password:
            </Text>
            <TextInput value={newP} onChangeText={setNewP}></TextInput>

            <Button title="set new" onPress={setPassword}></Button>
        </View>
    );
}
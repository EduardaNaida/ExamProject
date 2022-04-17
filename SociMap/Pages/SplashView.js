import { useEffect } from 'react';
import { View } from 'react-native';
import { DelayedLoginCheck } from '../FirebaseInterface'

export default SplashView = () => {
    const moveForward = (user) =>{
        if(user == null){
            //goto login
            return;
        }

        //goto main
    };

    useEffect(()=>{
        DelayedLoginCheck(moveForward)
    }, []);
}
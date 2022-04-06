
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, setPersistence, createUserWithEmailAndPassword, signOut  } from 'firebase/auth'

const app = initializeApp({
  apiKey: "AIzaSyARq36sGLC1ltpfqVMeMjgx-v5nbm7Ev5w",
  authDomain: "socimap-2b18e.firebaseapp.com",
  projectId: "socimap-2b18e",
  storageBucket: "socimap-2b18e.appspot.com",
  messagingSenderId: "1038195680118",
  appId: "1:1038195680118:web:92051d9ccc3fee341d5057",
  measurementId: "G-DB1JX1T6L8"
});
const auth = getAuth();

export async function AttemptSignIn(email, password){
    try{
        const result = await signInWithEmailAndPassword(auth, email, password);
        await setPersistence(auth, 'LOCAL');
        return result.user;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

export async function AttemptSignUp(email, password){
    const uc = await createUserWithEmailAndPassword(auth, email, password);
    return uc.user;
}

export async function SignOut(){
    await signOut(auth)
}

export function GetCurrentUser(){
    return auth.currentUser
}

export function GetUid(){
    if(GetCurrentUser() == null)
        return ""

    return GetCurrentUser().uid
}
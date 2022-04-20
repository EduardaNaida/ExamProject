
import { initializeApp } from 'firebase/app';
import { 
    getAuth, signInWithEmailAndPassword, setPersistence, 
    createUserWithEmailAndPassword, signOut, 
    reactNativeLocalPersistence, sendPasswordResetEmail, 
    onAuthStateChanged } from 'firebase/auth/react-native';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc} from 'firebase/firestore';

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
const db = getFirestore();

export async function AttemptSignIn(email, password){
    //try{
        await setPersistence(auth, reactNativeLocalPersistence);
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    //}
    //catch(err){
    //    console.log(err);
     //   return null;
    //}
}

export async function AttemptSignUp(email, password){
    await setPersistence(auth, reactNativeLocalPersistence);
    const uc = await createUserWithEmailAndPassword(auth, email, password);
    return uc.user;
}

export async function SignOut(){
    const result = await signOut(auth);
    console.log(result.user, 'User signed out!')
    return result.user;
}

export function GetCurrentUser(){
    return auth.currentUser;
}

export function GetUid(){
    if(GetCurrentUser() == null)
        return ""

    return GetCurrentUser().uid
}

export function DelayedLoginCheck(callback){
    
    setTimeout(()=>{callback(GetCurrentUser())}, 100);
}

export function SetAuthStateChangeCallback(callback){
    return onAuthStateChanged(auth, callback);
}

export async function GetPersonsFromPath(path){
    const ref = await getDocs(collection(db, path));
    let ret = [];
    //let ids = Array.from(ref.docs, (d => d.id));

    //console.log(ids);

    for(let i = 0; i < ref.docs.length; i++)
    {
        const d = ref.docs[i];
        //console.log(doc(db, 'Users', GetUid(), 'People', d.id).path);
        const r = await getDoc(doc(db, 'Users', GetUid(), 'People', d.id))
        
        ret.push({
            id: d.id,
            ...r.data()
        })
    }

    return ret;

    /*const q = query(collection(db, 'Users', GetUid(), 'People'), where(documentId(), 'in', ids))
    const arr = (await getDocs(q)).docs;
    //console.log("arrr", arr);
    return Array.from(arr, d => {
        console.log('id', d.id);
        return ({
            id:d.id, 
            ...d.data()
        });
    });*/
}

export async function AddNewPerson(person){
    const ref = await addDoc(collection(db, 'Users', GetUid(), 'People'), person);
    console.log(ref.id);
    return ref.id;
}
export function SendPasswordResetEmail(auth, email){

        const result = sendPasswordResetEmail(auth, email);
          // Redirect user to your login screen
          
          return result.user;
      
    // catch(error){
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   };
}


import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, signInWithEmailAndPassword, setPersistence, 
    createUserWithEmailAndPassword, signOut, 
    reactNativeLocalPersistence, sendPasswordResetEmail, 
    onAuthStateChanged } from 'firebase/auth/react-native';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

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
const storage = getStorage();

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

export async function GetPersonData(personId){
    const refGeneral = await getDoc(doc(db, 'Users', GetUid(), 'People', personId));
    const refHeadlines = await getDocs(collection(db, 'Users', GetUid(), 'People', personId, 'Notes'));

    const notes = [];

    for(const x of refHeadlines.docs){
        const refValues = await getDocs(collection(db, 'Users', GetUid(), 'People', personId, 'Notes', x.id, 'Values'));
        
        notes.push({
            id: x.id,
            ...x.data(),
            values: refValues.docs.map(x => ({
                value: x.get('value'),
                id: x.id
            }))
        })
    }

    const ret = {
        ...refGeneral.data(),
        notes: notes,
        id:refGeneral.id
    };


    return ret;
}

export async function AddValueToNote(personId, noteId, value){
    const col = collection(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values');
    const ref = await addDoc(col, {value:value});
    
    return ({value: value, id: ref.id});
}


export async function AddValueToNoteCustomId(personId, noteId, value, valueId){
    const col = doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values', valueId);
    await setDoc(col, {value:value});
    
    return ({value: value, id: valueId});
}

export async function RemoveValueFromNote(personId, noteId, valueId){
    await deleteDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values', valueId));
}

export async function UpdateValueOfNote(personId, noteId, valueId, newValue){
    await updateDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values', valueId), {value: newValue});
}

export async function RemoveNote(personId, noteId){
    await deleteDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId));
}

export async function AddNoteCustomId(personId, headline, noteId){
    console.log(personId, headline, noteId);
    await setDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId), {headline:headline});
}

export async function SetPersonImage(personId, imageUri){
    const blob = await (await fetch(imageUri)).blob();
    
    //const type = imageUri.split(/[#?]/)[0].split('.').pop().trim();
    const path = `Users/${GetUid()}/PeoplePics/${personId}`;

    const imageRef = await uploadBytes(ref(storage, path), blob);

    const url = await getDownloadURL(imageRef.ref);
    console.log(url);
    updateDoc(doc(db, 'Users', GetUid(), 'People', personId), {img:url});

    return url;
}

import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import {
    getAuth, signInWithEmailAndPassword, setPersistence,
    createUserWithEmailAndPassword, signOut,
    reactNativeLocalPersistence, sendPasswordResetEmail,
    onAuthStateChanged,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    deleteUser
} from 'firebase/auth/react-native';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
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
const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
})
const storage = getStorage();


enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

export async function AttemptSignIn(email, password) {
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

export async function AttemptSignUp(email, password) {
    await setPersistence(auth, reactNativeLocalPersistence);
    const uc = await createUserWithEmailAndPassword(auth, email, password);
    return uc.user;
}

export async function SignOut() {
    const result = await signOut(auth);
    console.log(result.user, 'User signed out!')
    return result.user;
}

export function GetCurrentUser() {
    return auth.currentUser;
}

export function GetUid() {
    if (GetCurrentUser() == null)
        return ""

    return GetCurrentUser().uid
}

export function DelayedLoginCheck(callback) {

    setTimeout(() => { callback(GetCurrentUser()) }, 100);
}

export function SetAuthStateChangeCallback(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function GetPersonsData(path) {
    const p = `Users/${GetUid()}/${path}/People`.replace("//", '/');
    const ref = await getDocs(collection(db, p));
    const ret = [];

    for (let index = 0; index < ref.docs.length; index++) {
        const element = ref.docs[index];

        const person = await GetPersonData(element.id);
        ret.push(person);
    }

    return ret;
}

export async function GetPersonsFromPath(path) {
    const p = `Users/${GetUid()}/${path}/People`.replace("//", '/');
    const ref = await getDocs(collection(db, p));
    let ret = [];
    //let ids = Array.from(ref.docs, (d => d.id));

    //console.log(ids);

    for (let i = 0; i < ref.docs.length; i++) {
        const d = ref.docs[i];
        //console.log(doc(db, 'Users', GetUid(), 'People', d.id).path);
        const r = await getDoc(doc(db, 'Users', GetUid(), 'People', d.id));

        if (!r.exists()) {
            RemovePersonFromCollection(path, d.id)
            continue;
        }

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

export async function AddNewPerson(person) {

    const notes = person.notes;
    const img = person.img;

    const personId = (await addDoc(collection(db, 'Users', GetUid(), 'People'), { name: person.name, img: '', color: person.color })).id;

    for (let x = 0; x < notes.length; x++) {
        const note = notes[x];

        const noteId = await AddNote(personId, note.headline);

        const values = note.values;
        for (let y = 0; y < values.length; y++) {
            const value = values[y].value;

            await AddValueToNote(personId, noteId, value);
        }
    }

    if (!img)
        return [personId, ''];

    const url = await SetPersonImage(personId, img);

    return [personId, url];
}

export async function AddNewPersonCustomId(person, id) {

    const notes = person.notes;
    const img = person.img;

    await setDoc(doc(db, 'Users', GetUid(), 'People', id), { name: person.name, img: '', color: person.color });

    for (let x = 0; x < notes.length; x++) {
        const note = notes[x];

        const noteId = await AddNote(id, note.headline);

        const values = note.values;
        for (let y = 0; y < values.length; y++) {
            const value = values[y].value;

            await AddValueToNote(id, noteId, value);
        }
    }

    if (!img)
        return [id, ''];

    const url = await SetPersonImage(id, img);

    return [id, url];
}

export function SendPasswordResetEmail(email) {

    const result = sendPasswordResetEmail(auth, email);
    // Redirect user to your login screen

    return result.user;

    // catch(error){
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   };
}

export async function GetPersonData(personId) {
    const refGeneral = await getDoc(doc(db, 'Users', GetUid(), 'People', personId));
    const refHeadlines = await getDocs(collection(db, 'Users', GetUid(), 'People', personId, 'Notes'));

    const notes = [];

    for (const x of refHeadlines.docs) {
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
        id: refGeneral.id
    };


    return ret;
}

export async function AddValueToNote(personId, noteId, value) {
    const col = collection(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values');
    const ref = await addDoc(col, { value: value });

    return ({ value: value, id: ref.id });
}


export async function AddValueToNoteCustomId(personId, noteId, value, valueId) {
    const col = doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values', valueId);
    await setDoc(col, { value: value });

    return ({ value: value, id: valueId });
}

export async function RemoveValueFromNote(personId, noteId, valueId) {
    await deleteDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values', valueId));
}

export async function UpdateValueOfNote(personId, noteId, valueId, newValue) {
    await updateDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId, 'Values', valueId), { value: newValue });
}

export async function RemoveNote(personId, noteId) {
    await deleteDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId));
}

export async function AddNoteCustomId(personId, headline, noteId) {
    await setDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId), { headline: headline });
}

export async function AddNote(personId, headline) {
    return (await addDoc(collection(db, 'Users', GetUid(), 'People', personId, 'Notes'), { headline: headline })).id;
}

export async function SetPersonImage(personId, imageUri) {
    const blob = await (await fetch(imageUri)).blob();

    //const type = imageUri.split(/[#?]/)[0].split('.').pop().trim();
    const path = `Users/${GetUid()}/PeoplePics/${personId}`;

    const imageRef = await uploadBytes(ref(storage, path), blob);

    const url = await getDownloadURL(imageRef.ref);
    console.log(url);
    updateDoc(doc(db, 'Users', GetUid(), 'People', personId), { img: url });

    return url;
}

export async function UpdatePersonFields(personId, obj) {
    await updateDoc(doc(db, 'Users', GetUid(), 'People', personId), obj);
}

export async function GetGroups(path) {
    const p = `Users/${GetUid()}/${path}/Groups`.replace("//", "/");

    const grps = await getDocs(collection(db, p));
    return grps.docs.map(x => {
        const dat = x.data();
        return ({ ...dat, id: x.id });
    })

}

export async function AddGroup(path, groupData) {
    const p = `Users/${GetUid()}/${path}/Groups`.replace("//", "/");

    const ref = await addDoc(collection(db, p), groupData);
    return ref.id;
}

export async function RemoveGroup(path, groupId) {
    const p = `Users/${GetUid()}/${path}/Groups/${groupId}`.replace("//", "/");
    await deleteDoc(doc(db, p));
}

export async function AddGroupCustomId(path, groupData, groupId) {
    const p = `Users/${GetUid()}/${path}/Groups`.replace("//", "/");
    console.log('p:', p);
    console.log('path:', path);
    await setDoc(doc(db, p, groupId), groupData);
}

export async function AddPersonIdToCollection(path, id) {
    const p = `Users/${GetUid()}/${path}/People`.replace("//", "/");
    console.log(p);

    await setDoc(doc(db, p, id), {});
}

export async function SetNewPassword(currentPassword, newPassword) {
    const credential = EmailAuthProvider.credential(
        GetCurrentUser().email,
        currentPassword
    );


    await reauthenticateWithCredential(GetCurrentUser(), credential);
    await updatePassword(GetCurrentUser(), newPassword);
}

export async function RemovePersonFromCollection(path, personId) {
    const p = `Users/${GetUid()}/${path}/People/${personId}`.replace("//", '/');
    const ref = doc(db, p);
    await deleteDoc(ref);
}

export async function RenameNote(personId, noteId, newName) {
    await updateDoc(doc(db, 'Users', GetUid(), 'People', personId, 'Notes', noteId), { headline: newName });
}

export async function deleteAcount(password){
    const credential = EmailAuthProvider.credential(
        GetCurrentUser().email,
        password
    );


    await reauthenticateWithCredential(GetCurrentUser(), credential);

    await deleteDoc(doc(db, `Users/${GetUid()}`));
    await deleteUser(GetCurrentUser());
}
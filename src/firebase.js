import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDoOT8xSFJ9e3qxLDGkGeoUZgKCkk9jw9U",
    authDomain: "watchpartyrescue.firebaseapp.com",
    projectId: "watchpartyrescue",
    storageBucket: "watchpartyrescue.appspot.com",
    messagingSenderId: "431182905331",
    appId: "1:431182905331:web:95a884d2241e888609dc86"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
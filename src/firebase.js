import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAz3BqiX2dy_cTFiVNb_TjJTiNj9TOcrI0",
    authDomain: "watchpartyrescue2.firebaseapp.com",
    projectId: "watchpartyrescue2",
    storageBucket: "watchpartyrescue2.appspot.com",
    messagingSenderId: "660775099353",
    appId: "1:660775099353:web:fe3ed8cd48717eef3217c8"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
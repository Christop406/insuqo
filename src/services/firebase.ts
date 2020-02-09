import firebaseConfig from '../config/firebase';
import firebase from 'firebase';

class Firebase {
    private static _instance: Firebase;

    private constructor() {
        firebase.initializeApp(firebaseConfig);
    }

    public get auth(): firebase.auth.Auth {
        return firebase.auth();
    }

    public static get instance(): Firebase {
        if (!this._instance) {
            this._instance = new Firebase();
        }

        return this._instance;
    }
}

export default Firebase.instance;
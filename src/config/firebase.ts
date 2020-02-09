const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    authDomain: 'insuqo-prod.firebaseapp.com',
    databaseURL: 'https://insuqo-prod.firebaseio.com',
    projectId: 'insuqo-prod',
    storageBucket: 'insuqo-prod.appspot.com',
    messagingSenderId: '124600508742',
};

export default firebaseConfig;
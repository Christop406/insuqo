const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    authDomain: 'iqprod.firebaseapp.com',
    databaseURL: 'https://iqprod.firebaseio.com',
    projectId: 'iqprod',
    storageBucket: 'iqprod.appspot.com',
    messagingSenderId: '571877692335',
};

export default firebaseConfig;

import firebase from 'firebase/app'
require('firebase/firestore')
require('firebase/database')
require('firebase/auth')

const firebaseConfig = {
  apiKey: 'AIzaSyBbNbzbSeug8LaFsQIOiChz-jdVnbJbBfk',
  authDomain: 'stockisfun-28972.firebaseapp.com',
  projectId: 'stockisfun-28972',
  storageBucket: 'stockisfun-28972.appspot.com',
  messagingSenderId: '185885043305',
  appId: '1:185885043305:web:2521e41bdcf49cdb8fd0f8'
}
try {
  firebase.initializeApp(firebaseConfig)
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

export default firebase

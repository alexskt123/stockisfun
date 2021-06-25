import firebase from '../config/fire-config'
import * as firebaseui from 'firebaseui'

export default firebase
export const auth = firebase.auth()
export const authUI = new firebaseui.auth.AuthUI(auth)

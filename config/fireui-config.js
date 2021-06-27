import * as firebaseui from 'firebaseui'

import firebase from '../config/fire-config'

export default firebase
export const auth = firebase.auth()
export const authUI = new firebaseui.auth.AuthUI(auth)

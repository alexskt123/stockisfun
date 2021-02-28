import firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

function FirebaseUI() {

    const uiConfig = {
        signInSuccessUrl: 'https://stockisfun.vercel.app/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: 'https://stockisfun.vercel.app/',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('https://stockisfun.vercel.app/');
        }
      };

      // Initialize the FirebaseUI Widget using Firebase.
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
    return (
        <Fragment>

        </Fragment>
    )
}

export default FirebaseUI

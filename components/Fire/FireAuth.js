import { useState, Fragment, useEffect, useMemo } from 'react'

import ModalQuestion from '@/components/Parts/ModalQuestion'
import firebase, { auth, authUI } from '@/config/fireui-config'
import { fireToast } from '@/lib/commonFunction'
import { initUser, useUserData } from '@/lib/firebaseResult'

import SignedInDisplay from './SignedInDisplay'
import SignedOutDisplay from './SignedOutDisplay'
import SignInModal from './SignInModal'

import 'firebaseui/dist/firebaseui.css'

function FireAuth({ user }) {
  const [show, setShow] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)

  const userData = useUserData(user)

  const handleClose = () => setShow(false)
  const handleSignOutClose = () => setShowSignOut(false)
  const handleShow = () => {
    setShow(true)
  }

  const handleSignOut = () => {
    auth.signOut()
    handleSignOutClose()
    fireToast({
      icon: 'success',
      title: 'Signed out'
    })
  }

  const handleUIError = error => {
    console.error(error)
  }

  const uiConfig = useMemo(
    () => ({
      autoUpgradeAnonymousUsers: true,
      //signInSuccessUrl: '/basics',
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, _redirectUrl) {
          //var user = authResult.user;
          // var credential = authResult.credential;
          // var isNewUser = authResult.additionalUserInfo.isNewUser;
          // var providerId = authResult.additionalUserInfo.providerId;
          // var operationType = authResult.operationType;
          initUser(authResult.user.uid)

          handleClose()
          // Do something with the returned AuthResult.
          // Return type determines whether we continue the redirect
          // automatically or whether we leave that to developer to handle.
          fireToast({
            icon: 'success',
            title: 'Signed in'
          })
          return false
        },
        signInFailure: function (error) {
          // Some unrecoverable error occurred during sign-in.
          // Return a promise when error handling is completed and FirebaseUI
          // will reset, clearing any UI. This commonly occurs for error code
          // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
          // occurs. Check below for more details on this.
          return handleUIError(error)
        }
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      signInFlow: 'popup'
    }),
    []
  )

  const modalQuestionSettings = {
    showCondition: showSignOut,
    onHide: handleSignOutClose,
    onClickYes: handleSignOut,
    onClickNo: handleSignOutClose,
    title: 'Sign Out',
    body: 'Are you sure to sign out?'
  }

  useEffect(() => {
    if (show && document.querySelector('.firebaseui-auth-container'))
      authUI.start('.firebaseui-auth-container', uiConfig)
  }, [show, uiConfig])

  return (
    <Fragment>
      {!user ? (
        <SignedOutDisplay handleShow={handleShow} />
      ) : (
        <SignedInDisplay
          user={user}
          userData={userData}
          setShowSignOut={setShowSignOut}
        />
      )}
      <SignInModal show={show} handleClose={handleClose} />
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment>
  )
}

export default FireAuth

import { useState, Fragment, useEffect } from "react";
import firebase, { auth, authUI } from "../config/fire-config";
import 'firebaseui/dist/firebaseui.css'
import { Badge, Button, Modal } from "react-bootstrap";
import { NavDropdown } from 'react-bootstrap'
import moment from 'moment-business-days'
import { FaUserCircle } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'

function FireAuth() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('Guest')
  const [loginTime, setLoginTime] = useState(null)

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  }

  const handleSignOut = () => {
    auth.signOut()
    console.log(user)
    setUser(undefined)
  }

  const handleUIError = (error) => {
    console.log(error)
  }

  const uiConfig = {
    autoUpgradeAnonymousUsers: true,
    //signInSuccessUrl: '/basics',
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // var user = authResult.user;
        // var credential = authResult.credential;
        // var isNewUser = authResult.additionalUserInfo.isNewUser;
        // var providerId = authResult.additionalUserInfo.providerId;
        // var operationType = authResult.operationType;

        handleClose()
        // Do something with the returned AuthResult.
        // Return type determines whether we continue the redirect
        // automatically or whether we leave that to developer to handle.
        return false;
      },
      signInFailure: function (error) {
        // Some unrecoverable error occurred during sign-in.
        // Return a promise when error handling is completed and FirebaseUI
        // will reset, clearing any UI. This commonly occurs for error code
        // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
        // occurs. Check below for more details on this.
        return handleUIError(error);
      }
    },
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    signInFlow: "redirect"
  }

  auth.onAuthStateChanged((user) => setUser(user));

  useEffect(() => {
    if (show && document.querySelector('.firebaseui-auth-container'))
      authUI.start(".firebaseui-auth-container", uiConfig);

    if (user) {
      user.displayName ? setDisplayName(user.displayName) : displayName
      setLoginTime(moment().format("HH:mm:ss DD/MM/YYYY"))
    }
  }, [show, user]);

  return (
    <Fragment>
      {
        !user ?
          <NavDropdown.Item onClick={handleShow}>
            <Badge variant="success">{'Sign In'}</Badge>
          </NavDropdown.Item>
          :
          <Fragment>
            <NavDropdown.Item >
              <FaUserCircle />
              <Badge className="ml-1" variant="dark">
                {displayName}
              </Badge>
              <BiTime className="ml-2" />
              <Badge variant="light">
                {`${loginTime}`}
              </Badge>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleSignOut}>
              <Badge variant="danger">{'Sign Out'}</Badge>
            </NavDropdown.Item>
          </Fragment>
      }
      <Modal centered size="sm" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="firebaseui-auth-container"></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default FireAuth;
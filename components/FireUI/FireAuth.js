import { useState, Fragment, useEffect, useContext } from 'react'
import firebase, { auth, authUI } from '../../config/fireui-config'
import { initUser } from '../../lib/firebaseResult'
import { Badge, Button, Col, Modal, Row } from 'react-bootstrap'
import { NavDropdown } from 'react-bootstrap'
import { FaUserCircle, FaList } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { CgViewList } from 'react-icons/cg'
import { Store } from '../../lib/store'
import { defaultUserConfig } from '../../config/settings'
import { fireToast } from '../../lib/toast'

import 'firebaseui/dist/firebaseui.css'
import Link from 'next/link'

function FireAuth() {
  const [show, setShow] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  //const [user, setUser] = useState(null)
  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

  const handleClose = () => setShow(false)
  const handleSignOutClose = () => setShowSignOut(false)
  const handleShow = () => {
    setShow(true)
  }

  const handleSignOut = () => {
    auth.signOut()
    dispatch({ type: 'USER', payload: { ...defaultUserConfig } })
    handleSignOutClose()
    fireToast({
      icon: 'success',
      title: 'Signed out'
    })
  }

  const handleUIError = (error) => {
    console.log(error)
  }

  const uiConfig = {
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
  }

  //auth.onAuthStateChanged((user) => setUser(user))

  useEffect(async () => {
    if (show && document.querySelector('.firebaseui-auth-container'))
      authUI.start('.firebaseui-auth-container', uiConfig)
  }, [show])

  return (
    <Fragment>
      {
        user.id == '' ?
          <NavDropdown.Item onClick={handleShow}>
            <Badge variant="success">{'Sign In'}</Badge>
          </NavDropdown.Item>
          :
          <Fragment>
            <NavDropdown.Item >
              <FaUserCircle />
              <Badge className="ml-1" variant="dark">
                {user.displayName}
              </Badge>
              <BiTime className="ml-2" />
              <Badge variant="light">
                {`${user.loginTime}`}
              </Badge>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <div className="container">
              <p>
                <FaList />
                <Badge className="ml-1" variant="light">{'Stock List'}</Badge>
              </p>
              <Row>
                {user.stockList.map((item, idx) => {
                  return (
                    <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                      <Badge className="ml-1" key={idx} variant="light"><Link href={`/basics?query=${item}`}>{item}</Link></Badge>
                    </Col>
                  )
                })}
              </Row>
            </div>
            <NavDropdown.Divider />
            <div className="container">
              <Row>
                <Col>
                  <CgViewList />
                  <Badge className="ml-1" variant="light"><Link href={`/watchlist?query=${user.watchList.join(',')}`}>{'Watch List'}</Link></Badge>
                </Col>
              </Row>
            </div>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => setShowSignOut(true)}>
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
      <Modal centered size="sm" show={showSignOut} onHide={handleSignOutClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to sign out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSignOut}>
            Yes
          </Button>
          <Button variant="danger" onClick={handleSignOutClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default FireAuth
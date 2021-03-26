import { useState, Fragment, useEffect, useContext } from 'react'
import firebase, { auth, authUI } from '../../config/fireui-config'
import { initUser } from '../../lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaUserCircle, FaList } from 'react-icons/fa'
import { BiTime } from 'react-icons/bi'
import { CgViewList } from 'react-icons/cg'
import { RiFundsBoxLine } from 'react-icons/ri'
import { Store } from '../../lib/store'
import { defaultUserConfig } from '../../config/settings'
import { fireToast } from '../../lib/toast'

import 'firebaseui/dist/firebaseui.css'
import Link from 'next/link'
import ModalQuestion from '../Parts/ModalQuestion'

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
  }, [show])

  return (
    <Fragment>
      {
        user.id == '' ?
          <Dropdown.Item onClick={handleShow}>
            <Badge variant="success">{'Sign In'}</Badge>
          </Dropdown.Item>
          :
          <Fragment>
            <Dropdown.Item >
              <FaUserCircle />
              <Badge className="ml-1" variant="dark">
                {user.displayName}
              </Badge>
              <BiTime className="ml-2" />
              <Badge variant="light">
                {`${user.loginTime}`}
              </Badge>
            </Dropdown.Item>
            <Dropdown.Divider />
            <div className="container">
              <p style={{ width: 'inherit' }}>
                <FaList />
                <Badge className="ml-1" variant="light">{'Stock List'}</Badge>
              </p>
              <Row>
                {user.stockList.map((item, idx) => {
                  return (
                    <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                      <Badge className="ml-1" key={idx} variant="light"><Link href={`/stockdetail?query=${item}`}>{item}</Link></Badge>
                    </Col>
                  )
                })}
              </Row>
            </div>
            <Dropdown.Divider />
            <div className="container">
              <p style={{ width: 'inherit' }}>
                <RiFundsBoxLine />
                <Badge className="ml-1" variant="light">{'ETF List'}</Badge>
              </p>
              <Row>
                {user.etfList.map((item, idx) => {
                  return (
                    <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                      <Badge className="ml-1" key={idx} variant="light"><Link href={`/etfdetail?query=${item}`}>{item}</Link></Badge>
                    </Col>
                  )
                })}
              </Row>
            </div>
            <Dropdown.Divider />
            <div className="container">
              <Row>
                <Col>
                  <CgViewList />
                  <Badge className="ml-1" variant="light"><Link href={`/watchlist?query=${user.watchList.join(',')}`}>{'Watch List'}</Link></Badge>
                </Col>
              </Row>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowSignOut(true)}>
              <Badge variant="danger">{'Sign Out'}</Badge>
            </Dropdown.Item>
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
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment>
  )
}

export default FireAuth
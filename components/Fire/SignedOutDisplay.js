import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'
import Dropdown from 'react-bootstrap/Dropdown'

const SignedOutDisplay = ({ handleShow }) => {
  return (
    <Fragment>
      <Dropdown.Item onClick={handleShow}>
        <Badge bg="success">{'Sign In'}</Badge>
      </Dropdown.Item>
    </Fragment>
  )
}

export default SignedOutDisplay

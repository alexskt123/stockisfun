import { Fragment } from 'react'

import Alert from 'react-bootstrap/Alert'

const LoginAlert = () => {
  return (
    <Fragment>
      <Alert variant="danger">
        <strong>{'Please Log in First!'}</strong>
      </Alert>
    </Fragment>
  )
}

export default LoginAlert

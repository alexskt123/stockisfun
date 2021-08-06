import { Fragment } from 'react'

import Container from 'react-bootstrap/Container'

export default function CustomContainer({ children, style }) {
  return (
    <Fragment>
      <Container style={style} className="mt-4 shadow-lg p-4 rounded">
        {{ ...children }}
      </Container>
    </Fragment>
  )
}

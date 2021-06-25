import Container from 'react-bootstrap/Container'
import { Fragment } from 'react'

export default function CustomContainer({ children, style }) {
  return (
    <Fragment>
      <Container style={style} className="mt-5 shadow-lg p-3 rounded">
        {{ ...children }}
      </Container>
    </Fragment>
  )
}

import { Fragment } from 'react'

import Row from 'react-bootstrap/Row'

import CustomContainer from '../../components/Layout/CustomContainer'
import GooeySpinner from './GooeySpinner'

export default function PageLoading() {
  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Row className="justify-content-center">
          <GooeySpinner />
        </Row>
      </CustomContainer>
    </Fragment>
  )
}

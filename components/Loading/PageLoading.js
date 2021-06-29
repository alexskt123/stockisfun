import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import Row from 'react-bootstrap/Row'

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

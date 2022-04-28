import { Fragment } from 'react'

import Row from 'react-bootstrap/Row'

import GooeySpinner from './GooeySpinner'
import CustomContainer from '@/components/Layout/CustomContainer'

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

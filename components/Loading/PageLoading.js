import { Fragment } from 'react'
import Row from 'react-bootstrap/Row'
import LoadingSpinner from './LoadingSpinner'
import CustomContainer from '../../components/CustomContainer'

export default function PageLoading() {
  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Row className="justify-content-center">
          <LoadingSpinner />
        </Row>
      </CustomContainer>
    </Fragment>

  )
}
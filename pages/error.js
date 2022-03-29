import Alert from 'react-bootstrap/Alert'

import CustomContainer from '@/components/Layout/CustomContainer'

const Error = () => {
  return (
    <CustomContainer style={{ height: '100vh' }}>
      <Alert variant={'warning'}>{'Opppppssss....'}</Alert>
    </CustomContainer>
  )
}

export default Error

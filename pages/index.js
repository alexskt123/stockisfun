import { useRouter } from 'next/router'
import { useEffect, Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import PageLoading from '../components/Loading/PageLoading'

//export default component
export default function CustomStep() {

  const router = useRouter()

  useEffect(() => {
    router.push('/stockdetail')
  }, [])

  //template
  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <PageLoading/>
      </Container>
    </Fragment>
  )
}


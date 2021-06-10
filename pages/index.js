import { useRouter } from 'next/router'
import { useEffect, Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import PageLoading from '../components/Loading/PageLoading'

//export default component
export default function Home() {

  const router = useRouter()

  useEffect(() => {
    router.push('/highlight')
  }, [])

  //template
  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="shadow-lg p-3 rounded">
        <PageLoading/>
      </Container>
    </Fragment>
  )
}


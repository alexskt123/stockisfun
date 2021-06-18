import { useRouter } from 'next/router'
import { useEffect, Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import PageLoading from '../components/Loading/PageLoading'

const mobile = require('is-mobile')

//export default component
export default function Home() {

  const router = useRouter()

  useEffect(() => {
    const redirectURL = mobile() ? 'https://stockisfun-git-pwa-alexskt123.vercel.app/highlight' : '/highlight'
    router.push(redirectURL)
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


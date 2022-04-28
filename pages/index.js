import { Fragment } from 'react'
import { useEffect } from 'react'

import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'

import PageLoading from '@/components/Loading/PageLoading'
import { useMobile } from '@/lib/hooks/useMobile'

export default function Home() {
  const router = useRouter()
  const redirectURL = useMobile()
    ? 'https://stockisfun-git-pwa-alexskt123.vercel.app/highlight'
    : '/highlight'

  useEffect(() => {
    router.push(redirectURL)
  }, [router, redirectURL])

  return (
    <Fragment>
      <Container
        style={{ minHeight: '100vh' }}
        className="shadow-lg p-3 rounded"
      >
        <PageLoading />
      </Container>
    </Fragment>
  )
}

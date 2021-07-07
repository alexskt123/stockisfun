import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

const mobile = require('is-mobile')

export const useMobile = () => {
  const router = useRouter()

  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    setIsMobile(mobile())
  }, [router])

  return isMobile
}

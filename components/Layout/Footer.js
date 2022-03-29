import Navbar from 'react-bootstrap/Navbar'

import AppContent from './Footer/AppContent'
import BrowserContent from './Footer/BrowserContent'
import Settings from '@/config/settings'
import { useMobile } from '@/lib/hooks/useMobile'

const footerConfig = {
  sticky: 'bottom',
  bg: 'dark',
  variant: 'dark'
}

export default function Footer() {
  const isMobile = useMobile()
  const newConfig = {
    ...footerConfig,
    fixed: isMobile && 'bottom'
  }

  return (
    <Navbar {...newConfig}>
      {isMobile ? (
        <AppContent />
      ) : (
        <BrowserContent content={Settings.Copyright} />
      )}
    </Navbar>
  )
}

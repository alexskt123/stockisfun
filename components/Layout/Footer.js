import Navbar from 'react-bootstrap/Navbar'
import Alert from 'react-bootstrap/Alert'
import Settings from '../../config/settings'

export default function Footer() {

  const footerConfig = {
    sticky: 'bottom',
    bg: 'dark',
    variant: 'dark'
  }

  return (
    <Navbar {...footerConfig}>
      <Navbar.Brand className="mx-auto">
        <Alert style={{padding: '0.1rem'}} variant="secondary">
          {Settings.Copyright}
        </Alert>
      </Navbar.Brand>
    </Navbar>
  )
}
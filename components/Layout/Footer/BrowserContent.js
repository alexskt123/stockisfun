import Alert from 'react-bootstrap/Alert'
import Navbar from 'react-bootstrap/Navbar'

const BrowserContent = ({ content }) => {
  return (
    <Navbar.Brand className="mx-auto">
      <Alert style={{ padding: '0.1rem' }} variant="secondary">
        {content}
      </Alert>
    </Navbar.Brand>
  )
}

export default BrowserContent

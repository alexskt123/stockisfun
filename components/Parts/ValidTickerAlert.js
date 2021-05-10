import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import useDarkMode from 'use-dark-mode'

export default function ValidTickerAlert() {

  const darkMode = useDarkMode(false)

  return (
    <Alert className="mt-2" key={'Alert-No-Stock-Info'} style={{ backgroundColor: darkMode.value ? '#7ca67e' : '#ebffe3' }}>
      <Badge variant="dark">
        {'Please enter a valid sticker!'}
      </Badge>
    </Alert>
  )
}
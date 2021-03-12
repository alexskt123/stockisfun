import Alert from 'react-bootstrap/Alert'

export default function ValidTickerAlert() {
  return (
    <Alert className="mt-2" key={'Alert-No-Stock-Info'} style={{backgroundColor: '#ebffe3'}}>
      {'Please enter a valid sticker!'}
    </Alert>
  )
}
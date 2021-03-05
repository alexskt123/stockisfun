import Alert from 'react-bootstrap/Alert'

export default function ValidTickerAlert() {
  return (
    <Alert className="mt-2" key={'Alert-No-Stock-Info'} variant={'warning'}>
      {'Please enter a valid sticker!'}
    </Alert>
  )
}
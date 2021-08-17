import { useBgColor } from '@/lib/hooks/useBgColor'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'

export default function ValidTickerAlert() {
  const bgColor = useBgColor('#9edce8', '#8fc3dbda')

  return (
    <Alert
      className="mt-2 "
      key={'Alert-No-Stock-Info'}
      style={{ backgroundColor: bgColor, padding: '0.5rem' }}
    >
      <Badge variant="dark">{'Please enter VALID ticker(s)!'}</Badge>
    </Alert>
  )
}

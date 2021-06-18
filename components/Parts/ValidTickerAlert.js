import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'

import { usebgColor } from '../../lib/hooks/usebgColor'

export default function ValidTickerAlert() {

  const bgColor = usebgColor('#7ca67e', '#ebffe3')

  return (
    <Alert className="mt-2" key={'Alert-No-Stock-Info'} style={{ backgroundColor: bgColor }}>
      <Badge variant="dark">
        {'Please enter a valid sticker!'}
      </Badge>
    </Alert>
  )
}
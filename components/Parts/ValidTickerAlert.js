import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'

import { useBgColor } from '../../lib/hooks/useBgColor'

export default function ValidTickerAlert() {
  const bgColor = useBgColor('#ebffe3', '#7ca67e')

  return (
    <Alert
      className="mt-2"
      key={'Alert-No-Stock-Info'}
      style={{ backgroundColor: bgColor }}
    >
      <Badge variant="dark">{'Please enter a valid sticker!'}</Badge>
    </Alert>
  )
}

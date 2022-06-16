import Badge from 'react-bootstrap/Badge'

import { convertToPrice } from '@/lib/commonFunction'

const CooldownBadge = ({ total }) => {
  return (
    <Badge className="ms-1" bg="secondary">
      {`Wait ${convertToPrice(total / 1000)} second(s)`}
    </Badge>
  )
}

export default CooldownBadge

import { convertToPrice } from '@/lib/commonFunction'
import Badge from 'react-bootstrap/Badge'

const CooldownBadge = ({ total }) => {
  return (
    <Badge className="ml-1" variant="secondary">
      {`Wait ${convertToPrice(total / 1000)} second(s)`}
    </Badge>
  )
}

export default CooldownBadge

import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'

export const SearchBadges = ({ type, query, variant, label, pushRoute }) => {
  const router = useRouter()

  return (
    <Badge
      as="button"
      className="mx-1"
      variant={router.query.type === type ? variant[0] : variant[1]}
      onClick={() => pushRoute(query)}
    >
      {router.query.type === type ? label[0] : label[1]}
    </Badge>
  )
}

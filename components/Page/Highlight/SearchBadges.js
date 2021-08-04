import { arrFindByIdx } from '@/lib/commonFunction'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'

export const SearchBadges = ({ type, query, variant, label, pushRoute }) => {
  const router = useRouter()

  return (
    <Badge
      as="button"
      className="mx-1"
      variant={
        (router.query.type === type && arrFindByIdx(variant, 0)) ||
        arrFindByIdx(variant, 1)
      }
      onClick={() => pushRoute(query)}
    >
      {(router.query.type === type && arrFindByIdx(label, 0)) ||
        arrFindByIdx(label, 1)}
    </Badge>
  )
}

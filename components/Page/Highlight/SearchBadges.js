import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'

import { arrFindByIdx } from '@/lib/commonFunction'

export const SearchBadges = ({ type, query, bg, label, pushRoute }) => {
  const router = useRouter()

  return (
    <Badge
      as="button"
      className="mx-1"
      bg={
        (router.query.type === type && arrFindByIdx(bg, 0)) ||
        arrFindByIdx(bg, 1)
      }
      onClick={() => pushRoute(query)}
    >
      {(router.query.type === type && arrFindByIdx(label, 0)) ||
        arrFindByIdx(label, 1)}
    </Badge>
  )
}

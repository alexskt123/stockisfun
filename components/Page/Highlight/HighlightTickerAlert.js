import { Fragment } from 'react'

import { SearchBadges } from '@/components/Page/Highlight/SearchBadges'
import HappyShare from '@/components/Parts/HappyShare'
import { searchBadges } from '@/config/highlight'
import { useRouter } from 'next/router'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import { IconContext } from 'react-icons'
import { MdCancel } from 'react-icons/md'

const HighlightTickerAlert = ({ valid }) => {
  const router = useRouter()

  //todo: change all query to ticker
  const { ticker, type } = router.query

  const cancelCurrentSearch = () => {
    router.push('/highlight')
  }

  const pushRoute = query => {
    const params = {
      ...router.query,
      ...query,
      type: type === query.type ? null : query.type
    }

    router.push(
      {
        query: params
      },
      undefined,
      { shallow: true }
    )
  }

  if (!ticker) return null

  return (
    <Fragment>
      <Alert
        style={{
          backgroundColor: '#f5f5f5',
          padding: '.3rem .3rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <strong>{'Current Search:'}</strong>

        <Badge className="ml-2" variant="info">
          {ticker}
        </Badge>
        <IconContext.Provider value={{ color: 'red' }}>
          <MdCancel
            onClick={() => cancelCurrentSearch()}
            className="ml-1 cursor"
          />
        </IconContext.Provider>

        {valid && <HappyShare />}

        {valid &&
          searchBadges.map(badge => (
            <SearchBadges key={badge.type} pushRoute={pushRoute} {...badge} />
          ))}
      </Alert>
    </Fragment>
  )
}

export default HighlightTickerAlert

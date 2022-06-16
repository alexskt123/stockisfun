import { Fragment } from 'react'

import { useRouter } from 'next/router'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import { IconContext } from 'react-icons'
import { MdCancel } from 'react-icons/md'

import { SearchBadges } from '@/components/Page/Highlight/SearchBadges'
import HappyShare from '@/components/Parts/HappyShare'
import { searchBadges } from '@/config/highlight'

const HighlightTickerAlert = ({ valid }) => {
  const router = useRouter()

  //todo: change all query to ticker
  const { ticker, type } = router.query

  const cancelCurrentSearch = () => {
    router.push(router.pathname)
  }

  const pushRoute = query => {
    const params = {
      ...router.query,
      ...query,
      type: (type !== query.type && query.type) || null
    }

    router.push(
      {
        query: params
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Fragment>
      {ticker && (
        <Alert
          style={{
            backgroundColor: '#f5f5f5',
            padding: '.3rem .3rem',
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px'
          }}
        >
          <strong>{'Current Search:'}</strong>
          <Badge className="ms-2" bg="info">
            {ticker}
          </Badge>
          <IconContext.Provider value={{ color: 'red' }}>
            <MdCancel
              onClick={() => cancelCurrentSearch()}
              className="ms-1 cursor"
            />
          </IconContext.Provider>
          {valid && <HappyShare />}
          {valid &&
            searchBadges.map(badge => (
              <SearchBadges key={badge.type} pushRoute={pushRoute} {...badge} />
            ))}
        </Alert>
      )}
    </Fragment>
  )
}

export default HighlightTickerAlert

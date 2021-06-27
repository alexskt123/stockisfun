import { Fragment } from 'react'

import { useRouter } from 'next/router'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import { IconContext } from 'react-icons'
import { MdCancel } from 'react-icons/md'

import HappyShare from '../../../components/Parts/HappyShare'

const HighlightTickerAlert = () => {
  const router = useRouter()

  const { query, type, show } = router.query

  const cancelCurrentSearch = () => {
    router.push('/highlight')
  }

  const pushQuote = () => {
    const isShow = !show || type === 'detail'
    const params = isShow ? { type: 'quote', show: true } : {}
    router.push(
      { query: { query: router.query.query, ...params } },
      undefined,
      {
        shallow: true
      }
    )
  }

  const pushDetail = () => {
    const isShow = !show || type === 'quote'
    const params = isShow ? { type: 'detail', show: true } : {}
    const tab = router.query.tab
    router.push(
      {
        query: {
          query: router.query.query,
          tab: tab ? tab : 'Price',
          ...params
        }
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Fragment>
      {query ? (
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
              {query}
            </Badge>
            <IconContext.Provider value={{ color: 'red' }}>
              <MdCancel
                onClick={() => cancelCurrentSearch()}
                className="ml-1 cursor"
              />
            </IconContext.Provider>
            <HappyShare />
            <Badge
              as="button"
              className="ml-3"
              variant={show && type === 'quote' ? 'danger' : 'warning'}
              onClick={() => pushQuote()}
            >
              {show && type === 'quote' ? 'Hide Price/Quote' : 'Price/Quote'}
            </Badge>
            <Badge
              as="button"
              className="ml-2"
              variant={show && type === 'detail' ? 'danger' : 'success'}
              onClick={() => pushDetail()}
            >
              {show && type === 'detail' ? 'Hide Details' : 'Details'}
            </Badge>
          </Alert>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default HighlightTickerAlert

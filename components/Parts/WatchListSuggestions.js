import { Fragment, useEffect, useState, useMemo } from 'react'

import HeaderBadge from '@/components/Parts/HeaderBadge'
import { hasProperties, randBackgroundColor } from '@/lib/commonFunction'
import { getHighlightWatchList } from '@/lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function WatchListSuggestions({ user, userData, onClickWatchListButton }) {
  const [list, setList] = useState([])
  const colorCallback = useMemo(() => {
    return list.map(_item => randBackgroundColor())
  }, [list])

  useEffect(() => {
    ;(async () => {
      const watchList = await getHighlightWatchList()
      const newWatchList = Object.keys(watchList).reduce((acc, cur) => {
        const item = { label: cur, list: watchList[cur] }
        return acc.concat(item)
      }, [])

      const listName = [
        { label: 'Watch List', name: 'watchList' },
        { label: 'Bought List', name: 'boughtList' }
      ]

      const listFromUserData = listName
        .map(x => {
          const { [x.name]: list = [] } = userData || {}
          const flatList = list.map(x =>
            hasProperties(x, ['ticker']) ? x.ticker : x
          )
          return { label: x.label, list: flatList }
        })
        .filter(x => x.list.length > 0)

      const list = newWatchList.concat(listFromUserData)
      setList(list)
    })()
  }, [user, userData])

  return (
    <Fragment>
      <Row className="justify-content-center mt-1">
        <HeaderBadge
          headerTag={'h6'}
          title={'Live Watch'}
          badgeProps={{ variant: 'dark', style: { minWidth: '9rem' } }}
        />
      </Row>
      <Row className="justify-content-center">
        {list.map((item, idx) => {
          return (
            <Col key={item.label}>
              <Button
                size="sm"
                className="w-100 my-2"
                style={{
                  backgroundColor: colorCallback[idx],
                  border: 'none',
                  paddingBottom: '0.2rem',
                  paddingTop: '0.2rem'
                }}
                onClick={() => onClickWatchListButton(item)}
              >
                <Badge>{item.label}</Badge>
              </Button>
            </Col>
          )
        })}
      </Row>
    </Fragment>
  )
}

export default WatchListSuggestions

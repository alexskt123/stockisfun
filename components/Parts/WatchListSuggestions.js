import { Fragment, useEffect, useState } from 'react'

import { randBackgroundColor } from '@/lib/commonFunction'
import { getHighlistWatchList } from '@/lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function WatchListSuggestions({ user, userData, onClickWatchListButton }) {
  const [list, setList] = useState([])

  useEffect(() => {
    ;(async () => {
      const watchList = await getHighlistWatchList()
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
            typeof x === typeof {} ? x?.ticker : x
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
        <h6>
          <Badge style={{ minWidth: '9rem' }} variant="dark">
            {'Live Watch'}
          </Badge>
        </h6>
      </Row>
      <Row className="justify-content-center">
        {list.map(item => {
          return (
            <Col key={item.label}>
              <Button
                size="sm"
                className="w-100 my-2"
                style={{ backgroundColor: randBackgroundColor() }}
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

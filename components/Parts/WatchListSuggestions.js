import { Fragment, useEffect, useState } from 'react'

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { randBackgroundColor } from '../../lib/commonFunction'
import { getHighlistWatchList } from '../../lib/firebaseResult'

function WatchListSuggestions({ user, userData, onClickWatchListButton }) {
  const [watchList, setWatchList] = useState([])

  useEffect(() => {
    ;(async () => {
      const watchList = await getHighlistWatchList()
      const { watchList: userWatchList, boughtList } = userData
      const appendWatchList =
        user && userWatchList && boughtList
          ? {
              'Watch List': userWatchList,
              'Bought List': boughtList.map(item => item.ticker)
            }
          : {}

      const newWatchList = {
        ...watchList,
        ...appendWatchList
      }

      setWatchList(newWatchList)
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
        {Object.keys(watchList).map((key, idx) => {
          return (
            <Col key={idx}>
              <Button
                size="sm"
                className="w-100 my-2"
                style={{ backgroundColor: randBackgroundColor() }}
                onClick={() => onClickWatchListButton(key, watchList[key])}
              >
                <Badge>{key}</Badge>
              </Button>
            </Col>
          )
        })}
      </Row>
    </Fragment>
  )
}

export default WatchListSuggestions

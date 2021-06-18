
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { Fragment, useEffect, useState } from 'react'
import { getHighlistWatchList, useUser, useUserData } from '../../lib/firebaseResult'
import { randVariant } from '../../lib/commonFunction'

function WatchListSuggestions({ onClickWatchListButton }) {
  const user = useUser()
  const userData = useUserData(user?.uid || '')

  const [watchList, setWatchList] = useState([])

  useEffect(() => {
    (async () => {
      const watchList = await getHighlistWatchList()
      const { watchList: userWatchList, boughtList } = userData
      const appendWatchList = userWatchList && boughtList ? { 'Watch List': userWatchList, 'Bought List': boughtList.map(item => item.ticker) } : {}

      const newWatchList = {
        ...watchList,
        ...appendWatchList
      }
      setWatchList(newWatchList)
    })()
  }, [userData])

  return (
    <Fragment>
      <Row className="justify-content-center mt-1">
        <h6>
          <Badge style={{ minWidth: '9rem' }} variant="dark">{'Live Watch'}</Badge>
        </h6>
      </Row>
      <Row className='justify-content-center mt-1'>
        {
          Object.keys(watchList).map((key, idx) => {
            return <Button size="sm" key={idx} className="ml-2" variant={randVariant(key)} onClick={() => onClickWatchListButton(key, watchList[key])}>
              <Badge>{key}</Badge>
            </Button>
          })
        }
      </Row>
    </Fragment>
  )
}

export default WatchListSuggestions

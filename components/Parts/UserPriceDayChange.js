import { Fragment, useState, useEffect } from 'react'

import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import AnimatedNumber from 'animated-number-react'

import { convertToPriceChange } from '../../lib/commonFunction'
import { fireToast } from '../../lib/toast'

const axios = require('axios').default

const UserPriceDayChange = ({ userID, userData }) => {
  const [dayChange, setDayChange] = useState(null)

  const refreshDayChange = async () => {
    await setBoughtListDayChange(userData.boughtList)

    fireToast({
      icon: 'success',
      title: 'Refreshed!'
    })
  }

  const setBoughtListDayChange = async boughtList => {
    const boughtListSum =
      boughtList && boughtList.length > 0
        ? await axios.get(`/api/getUserBoughtList?uid=${userID}`)
        : { data: { sum: null } }
    setDayChange(boughtListSum.data.sum)
  }

  useEffect(() => {
    ;(async () => {
      if (userData) await setBoughtListDayChange(userData.boughtList)
    })()
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  return (
    <Fragment>
      {
        <Fragment>
          <Row className="mt-1 justify-content-center">
            <Badge variant="light">{'Total Day Change:'}</Badge>
            <Badge
              variant={dayChange >= 0 ? 'success' : 'danger'}
              className="ml-1"
            >
              <AnimatedNumber
                value={dayChange}
                formatValue={value => convertToPriceChange(value)}
              />
            </Badge>
            <Badge
              className="ml-1 cursor"
              variant="warning"
              onClick={() => refreshDayChange()}
            >
              {'Refresh'}
            </Badge>
          </Row>
        </Fragment>
      }
    </Fragment>
  )
}

export default UserPriceDayChange

import { Fragment, useState, useEffect } from 'react'

import { convertToPriceChange, roundTo } from '@/lib/commonFunction'
import { fireToast } from '@/lib/toast'
import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

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
    const boughtListInfo =
      boughtList?.length > 0
        ? await axios.get(`/api/getUserBoughtList?uid=${userID}`)
        : { data: [] }
    const { data: boughtListData } = boughtListInfo
    const dayChgAndTotal = boughtListData.boughtList.reduce(
      (acc, cur) => {
        const newAcc = {
          net: acc.net + cur.net,
          sum: acc.sum + cur.sum
        }
        return newAcc
      },
      { net: 0, sum: 0 }
    )

    dayChgAndTotal.sum = dayChgAndTotal.sum + boughtListData.cash

    setDayChange(dayChgAndTotal)
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
            <Badge variant="light">{'Account Summary:'}</Badge>
            <Badge variant={'secondary'} className="ml-1">
              <AnimatedNumber
                value={dayChange?.sum}
                formatValue={value => roundTo(value)}
              />
            </Badge>
            <Badge
              variant={dayChange?.net >= 0 ? 'success' : 'danger'}
              className="ml-1"
            >
              <AnimatedNumber
                value={dayChange?.net}
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

import { Fragment, useState, useEffect } from 'react'

import { CooldownButton } from '@/components/CooldownButton'
import {
  convertToPercentage,
  convertToPriceChange,
  getVariant,
  roundTo
} from '@/lib/commonFunction'
import { fireToast } from '@/lib/commonFunction'
import { getBoughtListDayChange } from '@/lib/stockInfo'
import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

import CooldownBadge from './CooldownBadge'

const UserPriceDayChange = ({ userData }) => {
  const [dayChange, setDayChange] = useState(null)

  const refreshDayChange = async () => {
    await setBoughtListDayChange()

    fireToast({
      icon: 'success',
      title: 'Refreshed!'
    })
  }

  const setBoughtListDayChange = async () => {
    const dayChgAndTotal = await getBoughtListDayChange(userData)

    setDayChange(dayChgAndTotal)
  }

  useEffect(() => {
    ;(async () => {
      await setBoughtListDayChange()
    })()
    return () => setDayChange(null)
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
              variant={getVariant(
                dayChange?.net,
                'success',
                'secondary',
                'danger'
              )}
              className="ml-1"
            >
              <AnimatedNumber
                value={dayChange?.net}
                formatValue={value => convertToPriceChange(value)}
              />
            </Badge>
            <Badge
              variant={getVariant(
                dayChange?.pcnt,
                'success',
                'secondary',
                'danger'
              )}
              className="ml-1"
            >
              <AnimatedNumber
                value={dayChange?.pcnt}
                formatValue={value => convertToPercentage(value)}
              />
            </Badge>

            <CooldownButton
              stateKey={'priceDayChange'}
              cooldownTime={10 * 1000}
              handleClick={refreshDayChange}
              renderOnCDed={RefreshBadge}
              renderOnCDing={CooldownBadge}
            />
          </Row>
        </Fragment>
      }
    </Fragment>
  )
}

const RefreshBadge = ({ handleClick }) => {
  return (
    <Badge
      className="ml-1 cursor"
      variant="warning"
      onClick={() => handleClick()}
    >
      {'Refresh'}
    </Badge>
  )
}

export default UserPriceDayChange

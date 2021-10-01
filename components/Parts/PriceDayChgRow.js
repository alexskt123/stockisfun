import { Fragment } from 'react'

import { CooldownButton } from '@/components/CooldownButton'
import {
  convertToPercentage,
  convertToPriceChange,
  fireToast,
  getVariant,
  roundTo
} from '@/lib/commonFunction'
import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

import CooldownBadge from './CooldownBadge'

const PriceDayChgRow = ({
  data,
  key,
  header,
  setBoughtListDayChange,
  hideIfNA,
  showRefreshButton
}) => {
  const refreshDayChange = async () => {
    await setBoughtListDayChange()

    fireToast({
      icon: 'success',
      title: 'Refreshed!'
    })
  }

  return (
    <Fragment>
      {(!hideIfNA || (hideIfNA && data?.net)) && (
        <Row className="mt-1 justify-content-center">
          {header && <Badge variant="light">{header}</Badge>}
          <Badge variant={'secondary'} className="ml-1">
            <AnimatedNumber
              value={data?.sum}
              formatValue={value => roundTo(value)}
            />
          </Badge>
          <Badge
            variant={getVariant(data?.net, 'success', 'secondary', 'danger')}
            className="ml-1"
          >
            <AnimatedNumber
              value={data?.net}
              formatValue={value => convertToPriceChange(value)}
            />
          </Badge>
          <Badge
            variant={getVariant(data?.pcnt, 'success', 'secondary', 'danger')}
            className="ml-1"
          >
            <AnimatedNumber
              value={data?.pcnt}
              formatValue={value => convertToPercentage(value)}
            />
          </Badge>
          {showRefreshButton && (
            <CooldownButton
              stateKey={key}
              cooldownTime={10 * 1000}
              handleClick={refreshDayChange}
              renderOnCDed={RefreshBadge}
              renderOnCDing={CooldownBadge}
            />
          )}
        </Row>
      )}
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

export default PriceDayChgRow

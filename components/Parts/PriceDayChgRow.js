import { Fragment } from 'react'

import AnimatedNumber from 'animated-number-react'
import Badge from 'react-bootstrap/Badge'
import Stack from 'react-bootstrap/Stack'

import CooldownBadge from './CooldownBadge'
import { CooldownButton } from '@/components/CooldownButton'
import LoadingSkeleton from '@/components/Loading/LoadingSkeleton'
import {
  convertToPercentage,
  convertToPriceChange,
  fireToast,
  getVariant,
  roundTo
} from '@/lib/commonFunction'

const PriceDayChgRow = ({
  data,
  stateKey,
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
      {!data?.net && !hideIfNA && <LoadingSkeleton />}
      {((data?.net && !hideIfNA) || (hideIfNA && !Number.isNaN(data?.net))) && (
        <Stack
          direction="horizontal"
          className="mt-1 justify-content-center"
          gap={1}
        >
          {header && (
            <Badge bg="light" text="dark">
              {header}
            </Badge>
          )}
          <Badge bg={'secondary'}>
            <AnimatedNumber
              value={data?.sum}
              formatValue={value => roundTo(value)}
            />
          </Badge>
          <Badge bg={getVariant(data?.net, 'success', 'secondary', 'danger')}>
            <AnimatedNumber
              value={data?.net}
              formatValue={value => convertToPriceChange(value)}
            />
          </Badge>
          <Badge bg={getVariant(data?.pcnt, 'success', 'secondary', 'danger')}>
            <AnimatedNumber
              value={data?.pcnt}
              formatValue={value => convertToPercentage(value)}
            />
          </Badge>
          {showRefreshButton && (
            <CooldownButton
              stateKey={stateKey}
              cooldownTime={10 * 1000}
              handleClick={refreshDayChange}
              renderOnCDed={RefreshBadge}
              renderOnCDing={CooldownBadge}
            />
          )}
        </Stack>
      )}
    </Fragment>
  )
}

const RefreshBadge = ({ handleClick }) => {
  return (
    <Badge className="cursor" bg="warning" onClick={() => handleClick()}>
      {'Refresh'}
    </Badge>
  )
}

export default PriceDayChgRow

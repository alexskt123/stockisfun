import { Fragment } from 'react'

import Stack from 'react-bootstrap/Stack'

import TickerScrollMenu from './TickerScrollMenu'
import HeaderBadge from '@/components/Parts/HeaderBadge'

const TickerScrollMenuList = ({ tickerList }) => {
  return (
    <Fragment>
      {tickerList.map((item, idx) => {
        return (
          <Fragment key={idx}>
            <Stack
              direction="horizontal"
              className="mt-1 justify-content-center"
              gap={1}
            >
              <HeaderBadge
                headerTag={'h6'}
                title={item.name}
                badgeProps={{ bg: 'dark', style: { minWidth: '9rem' } }}
              />
            </Stack>
            <TickerScrollMenu
              inputList={item.inputList}
              setSelectedTicker={item.selectScrollMenuItem}
            />
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default TickerScrollMenuList

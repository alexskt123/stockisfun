import { Fragment, useEffect, useState, useMemo } from 'react'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'

import CustomScrollMenu from './CustomScrollMenu'
import HeaderBadge from './HeaderBadge'
import { hasProperties, randBackgroundColor } from '@/lib/commonFunction'
import { getHighlightWatchList } from '@/lib/firebaseResult'

function WatchListSuggestions({ user, userData, onClickWatchListButton }) {
  const [list, setList] = useState([])

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

      const list = listFromUserData.concat(newWatchList)
      setList(list)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userData])

  const onSelect = key => {
    onClickWatchListButton(list[key])
  }

  return (
    <Fragment>
      <Stack
        direction="horizontal"
        className="mt-1 justify-content-center"
        gap={1}
      >
        <HeaderBadge
          headerTag={'h6'}
          title={'Live Watch'}
          badgeProps={{ bg: 'dark', style: { minWidth: '9rem' } }}
        />
      </Stack>
      <CustomScrollMenu data={list} ChildComponent={Item} onSelect={onSelect} />
    </Fragment>
  )
}

export default WatchListSuggestions

export const Item = ({ label }) => {
  const colorCallback = useMemo(() => {
    return randBackgroundColor()
  }, [])

  return (
    <Col className="ms-2">
      <Button
        size="sm"
        className="w-100 my-2"
        style={{
          backgroundColor: colorCallback,
          border: 'none',
          paddingBottom: '0.2rem',
          paddingTop: '0.2rem'
        }}
      >
        {label}
      </Button>
    </Col>
  )
}

import { Fragment, useState, useEffect } from 'react'

import { fireToast } from '@/lib/commonFunction'
import { updUserAllList } from '@/lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import FormControl from 'react-bootstrap/FormControl'

const General = ({ user, userData }) => {
  //todo: remove settings, use readonly realtime data, let child component handle the rest
  const [settings, setSettings] = useState({
    stockList: [],
    etfList: [],
    watchList: [],
    boughtList: [],
    cash: 0
  })

  const filterInput = input => {
    return input
      .replace(/[^a-zA-Z,]/g, '')
      .toUpperCase()
      .split(',')
      .filter((value, idx, self) => self.indexOf(value) === idx)
  }

  const handleChange = (e, type) => {
    setSettings({
      ...settings,
      stockList:
        type === 'stock' ? filterInput(e.target.value) : settings.stockList,
      etfList: type === 'etf' ? filterInput(e.target.value) : settings.etfList,
      watchList:
        type === 'watchlist' ? filterInput(e.target.value) : settings.watchList,
      cash: type === 'cash' ? parseFloat(e.target.value) : settings.cash
    })
  }

  const updateAllList = async () => {
    await updUserAllList(user.uid, settings)

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const onUpdate = async () => {
    await updateAllList()
  }

  useEffect(() => {
    if (userData) {
      setSettings(s => ({
        ...s,
        ...userData
      }))
    }
  }, [userData])

  return (
    <Fragment>
      <h5>
        <Badge variant="dark">{'Update Stock List'}</Badge>
      </h5>
      <FormControl
        style={{ minHeight: '6rem' }}
        as="textarea"
        aria-label="With textarea"
        value={settings.stockList.join(',')}
        onChange={e => handleChange(e, 'stock')}
      />
      <h5>
        <Badge variant="dark">{'Update ETF List'}</Badge>
      </h5>
      <FormControl
        style={{ minHeight: '6rem' }}
        as="textarea"
        aria-label="With textarea"
        value={settings.etfList.join(',')}
        onChange={e => handleChange(e, 'etf')}
      />
      <h5>
        <Badge variant="dark">{'Update Watch List'}</Badge>
      </h5>
      <FormControl
        style={{ minHeight: '6rem' }}
        as="textarea"
        aria-label="With textarea"
        value={settings.watchList.join(',')}
        onChange={e => handleChange(e, 'watchlist')}
      />
      <h5>
        <Badge variant="dark">{'Update Cash'}</Badge>
      </h5>
      <FormControl
        style={{ minHeight: '1rem' }}
        value={settings.cash || 0}
        type="number"
        onChange={e => handleChange(e, 'cash')}
      />
      <ButtonGroup aria-label="Basic example">
        <Button onClick={() => onUpdate()} size="sm" variant="success">
          {'Update'}
        </Button>
      </ButtonGroup>
    </Fragment>
  )
}

export default General

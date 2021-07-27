import { Fragment, useState, useEffect } from 'react'

import { fireToast } from '@/lib/commonFunction'
import { updUserAllList } from '@/lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import FormControl from 'react-bootstrap/FormControl'

export const General = ({ user, userData }) => {
  //todo: remove settings, use readonly realtime data, let child component handle the rest
  const [settings, setSettings] = useState({
    stockList: [],
    etfList: [],
    watchList: [],
    boughtList: [],
    cash: 0
  })

  const filterInput = input => {
    return `${input}`
      .replace(/[^a-zA-Z,]/g, '')
      .toUpperCase()
      .split(',')
      .sort()
      .filter(x => x.trim().length > 0)
      .filter((value, idx, self) => self.indexOf(value) === idx)
  }

  const handleChange = (e, type) => {
    setSettings(s => ({
      ...s,
      [type]: e.target.value
    }))
  }

  const updateAllList = async () => {
    const newSettings = Object.keys({ ...settings }).reduce((acc, cur) => {
      const cb = cur === 'cash' ? input => parseFloat(input) || 0 : filterInput
      return Object.assign(acc, { [cur]: cb(settings[cur]) })
    }, {})

    await updUserAllList(user.uid, newSettings)

    setSettings(newSettings)

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

  const list = [
    {
      key: 'stock',
      name: 'stockList',
      badge: {
        title: 'Update Stock List'
      },
      control: {
        as: 'textarea',
        rows: '3'
      }
    },
    {
      key: 'etf',
      name: 'etfList',
      badge: {
        title: 'Update ETF List'
      },
      control: {
        as: 'textarea',
        rows: '3'
      }
    },
    {
      key: 'watch',
      name: 'watchList',
      badge: {
        title: 'Update Watch List'
      },
      control: {
        as: 'textarea',
        rows: '3'
      }
    },
    {
      key: 'cash',
      name: 'cash',
      badge: {
        title: 'Update Cash'
      },
      control: {
        type: 'number'
      }
    }
  ]

  return (
    <Fragment>
      <div className="d-flex flex-column my-5">
        {list.map(item => (
          <Fragment key={item.key}>
            <h5>
              <Badge variant="dark">{item.badge.title}</Badge>
            </h5>

            <FormControl
              value={settings[item.name]}
              onChange={e => handleChange(e, item.name)}
              {...(item?.control || {})}
            />
          </Fragment>
        ))}
      </div>

      <ButtonGroup aria-label="Basic example">
        <Button onClick={() => onUpdate()} size="sm" variant="success">
          {'Update'}
        </Button>
      </ButtonGroup>
    </Fragment>
  )
}

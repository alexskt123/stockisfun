import { Fragment, useState, useEffect } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import LoginAlert from '@/components/Parts/LoginAlert'
import BoughtList from '@/components/Tab/Admin/BoughtList'
import EmailConfig from '@/components/Tab/Admin/EmailConfig'
import { fireToast } from '@/lib/commonFunction'
import {
  updUserAllList,
  useUserData,
  usePersistedUser
} from '@/lib/firebaseResult'
import { useTab } from '@/lib/hooks/useTab'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import FormControl from 'react-bootstrap/FormControl'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

export default function Admin() {
  const user = usePersistedUser()
  const userData = useUserData(user)

  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, {
      shallow: true
    })
  }

  //todo: remove settings, use readonly realtime data, let child component handle the rest
  const [settings, setSettings] = useState({
    stockList: [],
    etfList: [],
    watchList: [],
    boughtList: [],
    cash: 0
  })

  useEffect(() => {
    //use function if you want prev state
    setSettings(s => ({
      ...s,
      ...userData
    }))
  }, [userData])

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

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {user ? (
            <Fragment>
              <Tabs
                style={{ fontSize: '11px' }}
                className="mt-1"
                activeKey={tab}
                onSelect={k => changeTab(k)}
              >
                <Tab eventKey="General" title="General">
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
                    <Button
                      onClick={() => onUpdate()}
                      size="sm"
                      variant="success"
                    >
                      {'Update'}
                    </Button>
                  </ButtonGroup>
                </Tab>
                <Tab eventKey="BoughtList" title="Bought List">
                  <BoughtList boughtList={settings.boughtList} />
                </Tab>
                <Tab eventKey="EmailConfig" title="Email Configuration">
                  <EmailConfig user={user} userData={userData} />
                </Tab>
              </Tabs>
            </Fragment>
          ) : (
            <LoginAlert />
          )}
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

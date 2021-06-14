
import { Fragment, useContext, useState, useEffect } from 'react'

import Badge from 'react-bootstrap/Badge'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Alert from 'react-bootstrap/Alert'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import CustomContainer from '../components/Layout/CustomContainer'
import { Store } from '../lib/store'
import { checkUserID } from '../lib/commonFunction'
import { updUserAllList, getUserInfoByUID } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'
import BoughtList from '../components/Tab/Admin/BoughtList'

export default function Admin() {
  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

  const [settings, setSettings] = useState({ stockList: [], etfList: [], watchList: [], boughtList: [] })

  useEffect(() => {
    setSettings({
      ...settings,
      stockList: [...user.stockList],
      etfList: [...user.etfList],
      watchList: [...user.watchList],
      boughtList: [...user.boughtList]
    })
  }, [user])

  const filterInput = (input) => {
    return input.replace(/[^a-zA-Z,]/g, '').toUpperCase().split(',').filter((value, idx, self) => self.indexOf(value) === idx)
  }

  const handleChange = (e, type) => {
    setSettings({
      ...settings,
      stockList: type === 'stock' ? filterInput(e.target.value) : settings.stockList,
      etfList: type === 'etf' ? filterInput(e.target.value) : settings.etfList,
      watchList: type === 'watchlist' ? filterInput(e.target.value) : settings.watchList
    })
  }

  const handleDispatch = async () => {
    const { stockList, etfList, watchList } = await getUserInfoByUID(user == null ? '' : user.uid)

    const newUserConfig = {
      ...user,
      stockList,
      etfList,
      watchList
    }

    dispatch({ type: 'USER', payload: newUserConfig })
  }

  const updateAllList = async () => {
    await updUserAllList(user.uid, settings)
    await handleDispatch()

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
          {
            checkUserID(user) ?
              <Fragment>
                <Tabs style={{ fontSize: '11px' }} className="mt-1" defaultActiveKey="General">
                  <Tab eventKey="General" title="General">
                    <h5><Badge variant="dark">{'Update Stock List'}</Badge></h5>
                    <FormControl style={{ minHeight: '6rem' }} as="textarea" aria-label="With textarea" value={settings.stockList.join(',')} onChange={(e) => handleChange(e, 'stock')} />
                    <h5><Badge variant="dark">{'Update ETF List'}</Badge></h5>
                    <FormControl style={{ minHeight: '6rem' }} as="textarea" aria-label="With textarea" value={settings.etfList.join(',')} onChange={(e) => handleChange(e, 'etf')} />
                    <h5><Badge variant="dark">{'Update Watch List'}</Badge></h5>
                    <FormControl style={{ minHeight: '6rem' }} as="textarea" aria-label="With textarea" value={settings.watchList.join(',')} onChange={(e) => handleChange(e, 'watchlist')} />
                    <ButtonGroup aria-label="Basic example">
                      <Button onClick={() => onUpdate()} size="sm" variant="success">{'Update'}</Button>
                    </ButtonGroup>
                  </Tab>
                  <Tab eventKey="BoughtList" title="Bought List">
                    <BoughtList boughtList={settings.boughtList}/>
                  </Tab>
                </Tabs>
              </Fragment>
              : <Alert variant="danger"><strong>{'Please Log in First!'}</strong></Alert>
          }
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}


import { Fragment, useState, useEffect } from 'react'

import Badge from 'react-bootstrap/Badge'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Alert from 'react-bootstrap/Alert'

import CustomContainer from '../components/Layout/CustomContainer'
import { updUserAllList, getUserInfoByUID } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'

import fire from '../config/fire-config'

export default function Admin() {

  const useUser = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
      fire.auth()
        .onAuthStateChanged(user => {
          setUser(user)
        })
    }, [])

    return user
  }

  const useUserData = (uid = '') => {
    const defaultUserData = {
      id: uid || '',
      stockList: [], etfList: [], watchList: []
    }

    const [data, setData] = useState(defaultUserData)

    useEffect(() => {
      const db = fire.firestore()

      db.collection('users')
        .where('userID', '==', uid)
        .limit(1)
        .onSnapshot((snap) => {
          const doc = snap.docs.find(x => x)
          const result = {
            ...defaultUserData,
            docId: doc?.id,
            ...doc?.data()
          }

          setData(result)
        })
    }, [uid])

    return data
  }

  const user = useUser()
  const userData = useUserData(user?.uid)

  const [settings, setSettings] = useState({ stockList: [], etfList: [], watchList: [] })

  useEffect(() => {
    setSettings({
      ...settings,
      stockList: [...userData.stockList],
      etfList: [...userData.etfList],
      watchList: [...userData.watchList]
    })
  }, [userData])

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
    const { stockList, etfList, watchList } = await getUserInfoByUID(userData == null ? '' : userData.uid)

    const newUserConfig = {
      ...userData,
      stockList,
      etfList,
      watchList
    }

  }

  const updateAllList = async () => {
    await updUserAllList(userData.uid, settings)
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
            user ?
              <Fragment>
                <h5><Badge variant="dark">{'Update Stock List'}</Badge></h5>
                <ul>
                  {settings.stockList.map(x => (<li key={x}>{x}</li>))}
                </ul>
                {/* <FormControl style={{ minHeight: '6rem' }} as="textarea" aria-label="With textarea" value={settings.stockList.join(',')} onChange={(e) => handleChange(e, 'stock')} /> */}
                <h5><Badge variant="dark">{'Update ETF List'}</Badge></h5>
                <ul>
                  {settings.etfList.map(x => (<li key={x}>{x}</li>))}
                </ul>
                {/* <FormControl style={{ minHeight: '6rem' }} as="textarea" aria-label="With textarea" value={settings.etfList.join(',')} onChange={(e) => handleChange(e, 'etf')} /> */}
                <h5><Badge variant="dark">{'Update Watch List'}</Badge></h5>
                <ul>
                  {settings.watchList.map(x => (<li key={x}>{x}</li>))}
                </ul>
                {/* <FormControl style={{ minHeight: '6rem' }} as="textarea" aria-label="With textarea" value={settings.watchList.join(',')} onChange={(e) => handleChange(e, 'watchlist')} /> */}
                <ButtonGroup aria-label="Basic example">
                  {/* <Button onClick={() => onUpdate()} size="sm" variant="success">{'Update'}</Button> */}
                </ButtonGroup>
              </Fragment>
              : <Alert variant="danger"><strong>{'Please Log in First!'}</strong></Alert>
          }
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}

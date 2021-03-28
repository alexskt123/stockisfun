
import { Fragment, useContext, useState, useEffect } from 'react'

import CustomContainer from '../components/Layout/CustomContainer'
import { Store } from '../lib/store'
import Badge from 'react-bootstrap/Badge'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { updUserAllList, getUserInfoByUID } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'

export default function Admin() {
    const store = useContext(Store)
    const { state, dispatch } = store
    const { user } = state

    const [settings, setSettings] = useState({ stockList: [], etfList: [], watchList: [] })

    useEffect(() => {
        setSettings({
            ...settings,
            stockList: [...user.stockList],
            etfList: [...user.etfList],
            watchList: [...user.watchList]
        })
    }, [user])

    const filterInput = (input) => {
        return input.replace(/[^a-zA-Z,]/g, "").toUpperCase().split(',').filter((value, idx, self) => self.indexOf(value) === idx)
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
                        user.id != '' ?
                            <Fragment>
                                <h5><Badge variant="dark">{'Update Stock List'}</Badge></h5>
                                <FormControl as="textarea" aria-label="With textarea" value={settings.stockList.join(',')} onChange={(e) => handleChange(e, 'stock')} />
                                <h5><Badge variant="dark">{'Update ETF List'}</Badge></h5>
                                <FormControl as="textarea" aria-label="With textarea" value={settings.etfList.join(',')} onChange={(e) => handleChange(e, 'etf')} />
                                <h5><Badge variant="dark">{'Update Watch List'}</Badge></h5>
                                <FormControl as="textarea" aria-label="With textarea" value={settings.watchList.join(',')} onChange={(e) => handleChange(e, 'watchlist')} />
                                <ButtonGroup aria-label="Basic example">
                                    <Button onClick={() => onUpdate()} size="sm" variant="success">{'Update'}</Button>
                                </ButtonGroup>
                            </Fragment>
                            : null
                    }
                </Fragment>
            </CustomContainer>
        </Fragment >
    )
}

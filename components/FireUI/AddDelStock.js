import { Fragment, useState, useEffect } from 'react'
import firebase from '../../config/fireui-config'
import { getUserInfoByUID, addToUserStockList, delFromUserStockList } from '../../lib/firebaseResult'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md'
import { IconContext } from 'react-icons'

function AddDelStock({ inputTicker }) {
    const [userSettings, setUserSettings] = useState({ uid: null, stockList: [] })

    const setUserStockList = async (uid) => {
        const { stockList } = await getUserInfoByUID(uid)
        setUserSettings({
            uid,
            stockList
        })
    }

    const handleRemove = async () => {
        await delFromUserStockList(userSettings.uid, inputTicker)
        await setUserStockList(userSettings.uid)
    }

    const handleAdd = async () => {
        await addToUserStockList(userSettings.uid, inputTicker)
        await setUserStockList(userSettings.uid)
    }

    useEffect(async () => {
        const user = firebase.auth().currentUser
        if (user && user.uid) {
            const { stockList } = await getUserInfoByUID(user.uid)
            setUserSettings({
                uid: user.uid,
                stockList
            })
        }
    }, [inputTicker])

    return (
        <Fragment>
            {
                userSettings.uid
                    ? userSettings.stockList.includes(inputTicker)
                        ? <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}>
                            <MdRemoveCircleOutline onClick={handleRemove} />
                        </IconContext.Provider>
                        : <IconContext.Provider value={{ color: 'green', className: 'global-class-name' }}>
                            <MdAddCircleOutline onClick={handleAdd} />
                        </IconContext.Provider>
                    : ''
            }
        </Fragment>
    )
}

export default AddDelStock
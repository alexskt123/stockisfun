
import { Fragment, useEffect, useState, useContext } from 'react'
import EditTable from '../../Page/EditTable'
import { fireToast } from '../../../lib/toast'
import { updUserBoughtList, getUserInfoByUID } from '../../../lib/firebaseResult'
import { Store } from '../../../lib/store'
import { integer } from '../../../lib/commonFunction'

export default function BoughtList({ boughtList }) {
    const store = useContext(Store)
    const { state, dispatch } = store
    const { user } = state

    const [data, setData] = useState([])

    const tableHeader = [
        { item: 'ticker', label: 'Ticker', type: 'text' },
        { item: 'total', label: 'Quantity', type: 'number' }
    ]

    useEffect(() => {
        setData(boughtList)
    }, [boughtList])

    const handleDispatch = async () => {
        const { boughtList } = await getUserInfoByUID(user == null ? '' : user.uid)

        const newUserConfig = {
            ...user,
            boughtList
        }

        dispatch({ type: 'USER', payload: newUserConfig })
    }

    const onUpdate = async (newData) => {
        const data = newData.filter(x => x.ticker !== '' && x.total !== "").map(item => {
            return {
                ...item,
                total: parseFloat(item.total)
            }
        })

        await updUserBoughtList(user.uid, data)

        await handleDispatch()

        fireToast({
            icon: 'success',
            title: 'Updated'
        })
    }

    return (
        <Fragment>
            <EditTable tableHeader={tableHeader} data={data} onUpdate={onUpdate} />
        </Fragment>
    )
}
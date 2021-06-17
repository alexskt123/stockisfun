
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { Fragment, useEffect, useState, useContext } from 'react'
import { getHighlistWatchList, getUserInfoByUID } from '../../lib/firebaseResult'
import { randVariant, checkUserID } from '../../lib/commonFunction'
import { Store } from '../../lib/store'

function WatchListSuggestions({ onClickWatchListButton }) {
    const store = useContext(Store)
    const { state } = store
    const { user } = state

    const [watchList, setWatchList] = useState([])

    useEffect(async () => {
        const watchList = await getHighlistWatchList()
        const { watchList: userWatchList, boughtList } = await getUserInfoByUID(user?.uid)
        const appendWatchList = checkUserID(user) ? {'Watch List': userWatchList, 'Bought List': boughtList.map(item => item.ticker)} : {}

        const newWatchList = {
            ...watchList,
            ...appendWatchList
        }
        setWatchList(newWatchList)
    }, [user])

    return (
        <Fragment>
            <Row className="justify-content-center">
                <h6>
                    <Badge style={{ minWidth: '9rem' }} variant="dark">{'Live Watch'}</Badge>
                </h6>
            </Row>
            <Row className='justify-content-center mt-1'>
                {
                    Object.keys(watchList).map((key, idx) => {
                        return <Button size="sm" key={idx} className="ml-2" variant={randVariant(key)} onClick={() => onClickWatchListButton(key, watchList[key])}>
                            <Badge>{key}</Badge>
                        </Button>
                    })
                }
            </Row>
        </Fragment>
    )
}

export default WatchListSuggestions


import { Fragment, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'

import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import { tableHeaderList } from '../config/watchlist'
import { handleDebounceChange } from '../lib/commonFunction'
import { updUserWatchList, getUserInfoByUID } from '../lib/firebaseResult'
import { Store } from '../lib/store'
import { fireToast } from '../lib/toast'
import ModalQuestion from '../components/Parts/ModalQuestion'
import SearchAccordion from '../components/Page/SearchAccordion'
import Row from 'react-bootstrap/Row'

import SWRTable from '../components/Page/SWRTable'
import HappyShare from '../components/Parts/HappyShare'

export default function WatchList() {

  const [tickers, setTickers] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const [showUpdate, setShowUpdate] = useState(false)
  const handleUpdateClose = () => setShowUpdate(false)

  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      setClicked(true)
      handleTickers(query)
      setClicked(false)
    } else if (tickers.length > 0) {
      handleTickers(tickers.join(','))
    }
  }, [query])

  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }


  const clearItems = () => {
    setTickers([])

    router.push('/watchlist')
  }

  const refreshItems = () => {
    if (tickers.length > 0)
      handleTickers(tickers.join(','))
  }

  const handleDispatch = async () => {
    const { watchList } = await getUserInfoByUID(user == null ? '' : user.uid)

    const newUserConfig = {
      ...user,
      watchList
    }

    dispatch({ type: 'USER', payload: newUserConfig })
  }

  const updateWatchList = async () => {
    await updUserWatchList(user.uid, tickers)
    await handleDispatch()

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const handleUpdate = async () => {
    handleUpdateClose()
    await updateWatchList()
  }

  const removeItem = (value) => {
    setTickers(
      [...tickers.filter(x => x !== value)]
    )
  }

  async function handleTickers(inputTickersWithComma) {
    const newTickers = inputTickersWithComma.split(',').map(item => item.toUpperCase())
    setTickers([...newTickers])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget


    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const { formTicker } = formValue
      await handleTickers(formTicker)
      router.push('/watchlist', `/watchlist?query=${formTicker.toUpperCase()}`)
    }
    setValidated(true)
  }

  const modalQuestionSettings = {
    showCondition: showUpdate,
    onHide: handleUpdateClose,
    onClickYes: handleUpdate,
    onClickNo: handleUpdateClose,
    title: 'Update Watch List',
    body: 'Are you sure the update watch list?'
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <SearchAccordion inputTicker={tickers.join(',')}>
            <TickerInput
              validated={validated}
              handleSubmit={handleSubmit}
              placeholderText={'Single:  voo /  Mulitple:  voo,arkk,smh'}
              handleChange={handleChange}
              clicked={clicked}
              clearItems={clearItems}
              exportFileName={'Stock_watch_list.csv'}
            />
            <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
          </SearchAccordion>
          {clicked ?
            <LoadingSpinner /> : null
          }
          <Row className="ml-1 mt-3" style={{display: 'flex', alignItems: 'center'}}>
            <Button onClick={() => { refreshItems() }} size='sm' variant='outline-dark' >{'Refresh'}</Button>
            {
              user.id != ''
                ? <Button className="ml-2" onClick={() => { setShowUpdate(true) }} size='sm' variant='dark' >{'Update Watch List'}</Button>
                : null
            }
            <HappyShare inputStyle={{ color: 'blue', size: '25px' }}/>
          </Row>

          {
            tickers.length > 0 ? <SWRTable
              requests={tickers.map(x => ({ request: `/api/yahoo/getYahooQuote?ticker=${x}`, key: x }))}
              options={{ striped: true, bordered: true, tableHeader: tableHeaderList, tableSize: 'sm', SWROptions: { refreshInterval: 3000 } }}
            /> : null
          }
        </Fragment>
      </CustomContainer>
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment >
  )
}

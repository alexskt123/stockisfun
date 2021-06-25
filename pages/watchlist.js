import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

import { tableHeaderList } from '../config/watchlist'
import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import ModalQuestion from '../components/Parts/ModalQuestion'
import SearchAccordion from '../components/Page/SearchAccordion'
import SWRTable from '../components/Page/SWRTable'
import HappyShare from '../components/Parts/HappyShare'

import { handleDebounceChange, handleFormSubmit } from '../lib/commonFunction'
import { updUserWatchList, useUser } from '../lib/firebaseResult'
import { fireToast } from '../lib/toast'
import { useQuery } from '../lib/hooks/useQuery'

export default function WatchList() {
  const router = useRouter()
  const { query } = router.query

  const [tickers, setTickers] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const [showUpdate, setShowUpdate] = useState(false)
  const handleUpdateClose = () => setShowUpdate(false)

  const user = useUser()

  const handleChange = e => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    router.push(router.pathname)
  }

  const updateWatchList = async () => {
    await updUserWatchList(user.uid, tickers)

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const handleUpdate = async () => {
    handleUpdateClose()
    await updateWatchList()
  }

  const removeItem = value => {
    setTickers([...tickers.filter(x => x !== value)])
  }

  async function handleTickers(inputTickersWithComma) {
    setClicked(true)
    const newTickers = inputTickersWithComma.map(item => item.toUpperCase())
    setTickers([...newTickers])
    setClicked(false)
  }

  const handleSubmit = event => {
    handleFormSubmit(event, formValue, { query }, router, setValidated)
  }

  const modalQuestionSettings = {
    showCondition: showUpdate,
    onHide: handleUpdateClose,
    onClickYes: handleUpdate,
    onClickNo: handleUpdateClose,
    title: 'Update Watch List',
    body: 'Are you sure the update watch list?'
  }

  useQuery(handleTickers, { query })

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
            <TickerBullet tickers={tickers} removeItem={removeItem} />
          </SearchAccordion>
          {clicked ? <LoadingSpinner /> : null}
          <Row
            className="ml-1 mt-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {user ? (
              <Button
                className="ml-2"
                onClick={() => {
                  setShowUpdate(true)
                }}
                size="sm"
                variant="dark"
              >
                {'Update Watch List'}
              </Button>
            ) : null}
            {tickers.length > 0 ? (
              <HappyShare inputStyle={{ color: 'blue', size: '25px' }} />
            ) : null}
          </Row>

          {tickers.length > 0 ? (
            <SWRTable
              requests={tickers.map(x => ({
                request: `/api/yahoo/getYahooQuote?ticker=${x}`,
                key: x
              }))}
              options={{
                striped: true,
                bordered: true,
                tableHeader: tableHeaderList,
                exportFileName: 'Watchlist.csv',
                tableSize: 'sm',
                SWROptions: { refreshInterval: 3000 }
              }}
            />
          ) : null}
        </Fragment>
      </CustomContainer>
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment>
  )
}

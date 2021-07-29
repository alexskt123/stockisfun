import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import SearchAccordion from '@/components/Page/SearchAccordion'
import SWRTable from '@/components/Page/SWRTable'
import TickerBullet from '@/components/Page/TickerBullet'
import TickerInput from '@/components/Page/TickerInput'
import HappyShare from '@/components/Parts/HappyShare'
import ModalQuestion from '@/components/Parts/ModalQuestion'
import { tableHeaderList } from '@/config/watchlist'
import {
  handleDebounceChange,
  handleFormSubmit,
  fireToast
} from '@/lib/commonFunction'
import {
  updateUserData,
  usePersistedUser,
  useUserData
} from '@/lib/firebaseResult'
import { useQuery } from '@/lib/hooks/useQuery'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

export default function WatchList() {
  const router = useRouter()
  const { query } = router.query

  const [tickers, setTickers] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const [showUpdate, setShowUpdate] = useState(false)
  const handleUpdateClose = () => setShowUpdate(false)

  const user = usePersistedUser()
  const userData = useUserData(user)

  const handleChange = e => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    router.push(router.pathname)
  }

  const updateWatchList = async () => {
    await updateUserData(userData.docId, {
      watchList: [...tickers]
    })

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
    const newTickers = inputTickersWithComma.map(item => item.toUpperCase())
    setTickers([...newTickers])
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
              placeholderText={'Single:  voo /  Multiple:  voo,arkk,smh'}
              handleChange={handleChange}
              clearItems={clearItems}
              exportFileName={'Stock_watch_list.csv'}
            />
            <TickerBullet tickers={tickers} removeItem={removeItem} />
          </SearchAccordion>
          <Row
            className="ml-1 mt-3"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {user && (
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
            )}
            {tickers.length > 0 && (
              <HappyShare inputStyle={{ color: 'blue', size: '25px' }} />
            )}
          </Row>

          {tickers?.length > 0 && (
            <SWRTable
              requests={tickers.map(x => ({
                request: `/api/page/getWatchList?ticker=${x}`,
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
          )}
        </Fragment>
      </CustomContainer>
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment>
  )
}

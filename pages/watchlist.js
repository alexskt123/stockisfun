import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import SearchAccordion from '@/components/Page/SearchAccordion'
import TickerBullet from '@/components/Page/TickerBullet'
import TickerInput from '@/components/Page/TickerInput'
import CompareSWR from '@/components/Parts/CompareSWR'
import HappyShare from '@/components/Parts/HappyShare'
import ModalQuestion from '@/components/Parts/ModalQuestion'
import { tableHeaderList } from '@/config/watchlist'
import { handleFormSubmit, fireToast } from '@/lib/commonFunction'
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
  const { tickers } = router.query

  const [curTickers, setCurTickers] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const [showUpdate, setShowUpdate] = useState(false)
  const handleUpdateClose = () => setShowUpdate(false)

  const user = usePersistedUser()
  const userData = useUserData(user)

  const handleChange = e => {
    const form = {
      ...formValue,
      [e.target.name]: e.target.value
    }
    setFormValue(form)
  }

  const clearItems = () => {
    router.push(router.pathname)
  }

  const updateWatchList = async () => {
    await updateUserData(userData.docId, {
      watchList: [...curTickers]
    })

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const handleUpdate = async () => {
    handleUpdateClose()
    updateWatchList()
  }

  const removeItem = value => {
    setCurTickers([...curTickers.filter(x => x !== value)])
  }

  async function handleTickers(inputTickersWithComma) {
    const newTickers = inputTickersWithComma.map(item => item.toUpperCase())
    setCurTickers([...newTickers])
  }

  const handleSubmit = event => {
    handleFormSubmit(event, formValue, { tickers }, router, setValidated)
  }

  const modalQuestionSettings = {
    showCondition: showUpdate,
    onHide: handleUpdateClose,
    onClickYes: handleUpdate,
    onClickNo: handleUpdateClose,
    title: 'Update Watch List',
    body: 'Are you sure the update watch list?'
  }

  useQuery(handleTickers, { tickers })

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <SearchAccordion inputTicker={curTickers.join(',')}>
            <TickerInput
              validated={validated}
              handleSubmit={handleSubmit}
              placeholderText={'Single:  voo /  Multiple:  voo,arkk,smh'}
              handleChange={handleChange}
              clearItems={clearItems}
              exportFileName={'Stock_watch_list.csv'}
              formValue={formValue}
            />
            <TickerBullet
              tickers={curTickers.join(',')}
              removeItem={removeItem}
            />
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
            {curTickers.length > 0 && (
              <HappyShare inputStyle={{ color: 'blue', size: '25px' }} />
            )}
          </Row>
          <CompareSWR
            inputTickers={curTickers}
            url={'/api/page/getWatchList'}
            customOptions={{
              exportFileName: 'Watchlist.csv',
              tableHeader: tableHeaderList,
              SWROptions: { refreshInterval: 3000 }
            }}
          />
        </Fragment>
      </CustomContainer>
      <ModalQuestion {...modalQuestionSettings} />
    </Fragment>
  )
}

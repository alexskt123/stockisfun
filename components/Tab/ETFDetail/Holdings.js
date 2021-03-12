
import { Fragment, useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { Doughnut } from 'react-chartjs-2'
import { BsEye } from 'react-icons/bs'
import { useRouter } from 'next/router'

import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import StockInfoTable from '../../../components/Page/StockInfoTable'

import { etfDetailsHoldingSettings } from '../../../config/etf'
import { getETFDetailHoldings } from '../../../lib/commonFunction'
import { sortTableItem } from '../../../lib/commonFunction'

export default function Holdings({ inputETFTicker, cellClick }) {
  const [allowCheck, setAllowCheck] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [ascSort, setAscSort] = useState(false)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({ ...etfDetailsHoldingSettings })

  const router = useRouter()
  const { query } = router.query

  useEffect(async () => {
    if (query) {
      await handleTicker(query.toUpperCase())
    } else if (inputETFTicker) {
      await handleTicker(inputETFTicker.toUpperCase())
    }
  }, [query, inputETFTicker])

  const sortItem = async (index) => {
    setSettings({
      ...settings,
      tableData: await sortTableItem(settings.tableData, index, ascSort)
    })
    setAscSort(!ascSort)
  }

  async function handleTicker(inputETFTicker) {
    setLoading(true)
    setAllowCheck(false)
    clearItems()

    const newSettings = await getETFDetailHoldings(inputETFTicker)
    setSettings({
      ...etfDetailsHoldingSettings,
      ...newSettings
    })
    setAllowCheck(newSettings.priceHref != '/' ? true : false)
    setLoading(false)
  }

  const clearItems = () => {
    setSettings({ ...etfDetailsHoldingSettings })
  }

  return (
    <Fragment>
      {loading ? <LoadingSpinner /> : null}
      <Row className="mt-3 ml-1">
        {!showAlert && <Button size="sm" variant="warning" onClick={() => setShowAlert(true)}>{'Details?'}</Button>}
        <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.priceHref} variant="dark">{'All Price%'}</Button>
        <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.forecastHref} variant="outline-dark">{'All Forecast'}</Button>
        <Button size="sm" disabled={!allowCheck} target="_blank" className="ml-2" href={settings.watchlistHref} variant="outline-success"><BsEye /></Button>
      </Row>
      <Row className="mt-1 ml-1">
        <Alert show={showAlert} variant="warning">
          <Alert.Heading>{'How to get Stock Details?'}</Alert.Heading>
          <p>
            {'Click the below table row to get!'}
          </p>
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShowAlert(false)} variant="outline-success">
              {'Close!'}
            </Button>
          </div>
        </Alert>
      </Row>
      <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.tableData} sortItem={sortItem} cellClick={cellClick} />
      <Doughnut data={settings.pieData} />
    </Fragment >
  )
}

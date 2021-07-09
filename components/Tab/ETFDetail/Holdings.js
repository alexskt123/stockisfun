import { Fragment, useState, useEffect } from 'react'

import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import StockInfoTable from '@/components/Page/StockInfoTable'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { etfDetailsHoldingSettings } from '@/config/etf'
import { sortTableItem } from '@/lib/commonFunction'
import { getETFDetailHoldings } from '@/lib/stockInfo'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import CardDeck from 'react-bootstrap/CardDeck'
import Row from 'react-bootstrap/Row'
import { Doughnut } from 'react-chartjs-2'
import { BsEye } from 'react-icons/bs'

export default function Holdings({ inputETFTicker, cellClick }) {
  const [allowCheck, setAllowCheck] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [ascSort, setAscSort] = useState(false)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({ ...etfDetailsHoldingSettings })

  useEffect(() => {
    ;(async () => {
      if (inputETFTicker) {
        await handleTicker(inputETFTicker)
      }
    })()
    return () => setSettings(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputETFTicker])

  const sortItem = async index => {
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
    setAllowCheck(newSettings.priceHref !== '/' ? true : false)

    setLoading(false)
  }

  const clearItems = () => {
    setSettings({ ...etfDetailsHoldingSettings })
  }

  return (
    <Fragment>
      {loading ? (
        <LoadingSkeletonTable />
      ) : inputETFTicker ? (
        <Fragment>
          <CardDeck className="mt-3">
            <QuoteCard
              header={'Chart'}
              inputTicker={inputETFTicker}
              isShow={true}
              noClose={true}
            >
              <h5>
                <Badge variant="light">{'No. of Holdings: '}</Badge>
                <Badge variant="dark">{settings?.noOfHoldings}</Badge>
              </h5>
              <Doughnut data={settings?.pieData} />
            </QuoteCard>
            <QuoteCard
              header={'Details'}
              inputTicker={inputETFTicker}
              isShow={true}
              noClose={true}
            >
              <Row className="mt-2 ml-1">
                {!showAlert && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => setShowAlert(true)}
                  >
                    {'Details?'}
                  </Button>
                )}
                <Button
                  size="sm"
                  disabled={!allowCheck}
                  target="_blank"
                  className="ml-2"
                  href={settings.priceHref}
                  variant="dark"
                >
                  {'All Price%'}
                </Button>
                <Button
                  size="sm"
                  disabled={!allowCheck}
                  target="_blank"
                  className="ml-2"
                  href={settings.forecastHref}
                  variant="outline-dark"
                >
                  {'All Forecast'}
                </Button>
                <Button
                  size="sm"
                  disabled={!allowCheck}
                  target="_blank"
                  className="ml-2"
                  href={settings.watchlistHref}
                  variant="outline-success"
                >
                  <BsEye />
                </Button>
              </Row>
              <Row className="mt-1 ml-1">
                <Alert show={showAlert} variant="warning">
                  <Alert.Heading>{'How to get Stock Details?'}</Alert.Heading>
                  <p>{'Click the below table row to get!'}</p>
                  <div className="d-flex justify-content-end">
                    <Button
                      onClick={() => setShowAlert(false)}
                      variant="outline-success"
                    >
                      {'Close!'}
                    </Button>
                  </div>
                </Alert>
              </Row>
              <StockInfoTable
                tableSize="sm"
                tableHeader={settings.tableHeader}
                tableData={settings.tableData}
                sortItem={sortItem}
                cellClick={cellClick}
              />
            </QuoteCard>
          </CardDeck>
        </Fragment>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}

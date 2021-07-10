import { Fragment, useState, useEffect } from 'react'

import AddDelStock from '@/components/Fire/AddDelStock'
import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import HappyShare from '@/components/Parts/HappyShare'
import Price from '@/components/Parts/Price'
import QuoteCard from '@/components/Parts/QuoteCard'
import ValidTickerAlert from '@/components/Parts/ValidTickerAlert'
import { priceTabLabelPairs } from '@/config/price'
import { staticSWROptions, fetcher } from '@/config/settings'
import { convertToPercentage } from '@/lib/commonFunction'
import { getBasics } from '@/lib/stockInfo'
// import { fireToast } from '@/lib/toast'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import useSWR from 'swr'

const defaultSettings = { basics: { tableData: [] }, floatingShareRatio: 'N/A' }

function PriceTab({ inputTicker }) {
  const { data } = useSWR(
    `/api/getStockDetailPriceTab?ticker=${inputTicker}`,
    fetcher,
    staticSWROptions
  )

  const [settings, setSettings] = useState(defaultSettings)
  const [labels, setLabels] = useState([...priceTabLabelPairs])

  useEffect(() => {
    //todo: fix all problems with {} instead of null...
    if (!data?.basics.Name) {
      // if (data && inputTicker) {
      //   fireToast({
      //     icon: 'error',
      //     title: 'Invalid Ticker'
      //   })
      // }
      setSettings(defaultSettings)
      return
    }

    const handledData = data || { basics: {}, floatingShareRatio: 'N/A' }

    const { basics } = handledData
    const basicsData = getBasics(basics) || { tableData: [] }

    setLabels(
      priceTabLabelPairs.map(item => {
        return {
          name: item.name,
          value: (basicsData.basics.tableData
            .filter(x => x.find(x => x) === item.name)
            .find(x => x) || [])[1]
        }
      })
    )

    if (data && basicsData.basics.tableData) {
      setSettings(s => ({
        ...s,
        basics: basicsData.basics,
        floatingShareRatio: handledData.floatingShareRatio
      }))
    }
  }, [data, inputTicker])

  return !data ? (
    <LoadingSkeletonTable />
  ) : settings.basics.tableData
      .filter(x => x.find(x => x) === 'Price')
      .find(x => x) ? (
    <Fragment>
      <Row className="ml-1 mt-1" style={{ display: 'flex', alignItems: 'end' }}>
        <h6>
          <Badge variant="dark">{'Name: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">
            {labels.find(x => x.name === 'Name').value}
          </Badge>
        </h6>
        <AddDelStock inputTicker={inputTicker} handleList="stock" />
        <HappyShare />
      </Row>
      <Row className="ml-1">
        <h6>
          <Badge variant="dark">{'Price: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">
            {labels.find(x => x.name === 'Price').value}
          </Badge>
        </h6>
        <h6>
          <Badge
            variant={
              labels.find(x => x.name === 'Price%').value >= 0
                ? 'success'
                : 'danger'
            }
          >
            {convertToPercentage(
              labels.find(x => x.name === 'Price%').value / 100
            )}
          </Badge>
        </h6>
        <h6>
          <Badge className="ml-3" variant="dark">
            {'52W-L-H: '}
          </Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">
            {labels.find(x => x.name === '52W-L-H').value}
          </Badge>
        </h6>
      </Row>
      <Row className="ml-1">
        <h6>
          <Badge variant="dark">{'Floating Shares: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">
            {settings.floatingShareRatio}
          </Badge>
        </h6>
        <h6>
          <Badge variant="dark" className="ml-2">
            {'Market Cap.: '}
          </Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">
            {labels.find(x => x.name === 'Market Cap.').value}
          </Badge>
        </h6>
      </Row>
      <Row className="ml-1">
        <h6>
          <Badge variant="dark">{'Industry: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">
            {labels.find(x => x.name === 'Industry').value}
          </Badge>
        </h6>
      </Row>
      <QuoteCard
        inputTicker={inputTicker}
        isShow={true}
        minWidth={'20rem'}
        noClose={true}
      >
        <Price inputTicker={inputTicker} inputMA={'ma'} />
      </QuoteCard>
    </Fragment>
  ) : (
    <ValidTickerAlert />
  )
}

export default PriceTab


import { Fragment, useState, useEffect } from 'react'
import Price from '../../Parts/Price'
import { priceTabLabelPairs } from '../../../config/price'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import AddDelStock from '../../Fire/AddDelStock'
import { convertToPercentage } from '../../../lib/commonFunction'
import HappyShare from '../../Parts/HappyShare'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

import { staticSWROptions, fetcher } from '../../../config/settings'

import { getBasics } from '../../../lib/stockDetailsFunction'
import { fireToast } from '../../../lib/toast'

import useSWR from 'swr'
import LoadingSpinner from '../../Loading/LoadingSpinner'

function PriceTab({ inputTicker }) {

  const { data } = useSWR(`/api/getStockDetailPriceTab?ticker=${inputTicker}`, fetcher, staticSWROptions)

  const [settings, setSettings] = useState({ basics: { tableData: [] }, floatingShareRatio: 'N/A' })
  const [labels, setLabels] = useState([...priceTabLabelPairs])

  useEffect(() => {
    if (data) {
      const { basics } = data
      const basicsData = getBasics(basics) || { tableData: [] }

      setLabels(priceTabLabelPairs.map(item => {
        return {
          'name': item.name,
          'value': (basicsData.basics.tableData.filter(x => x && x.find(x => x) == item.name).find(x => x) || [])[1]
        }
      }))

      if (inputTicker && !basicsData.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x))
        fireToast({
          icon: 'error',
          title: 'Invalid Ticker'
        })

      setSettings({ ...settings, basics: basicsData.basics, floatingShareRatio: data.floatingShareRatio })
    }
  }, [data])

  return (
    !data
      ? <LoadingSpinner />
      : settings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
        ? <Fragment>
          <Row className="ml-1 mt-1" style={{ display: 'flex', alignItems: 'end' }}>
            <h6>
              <Badge variant="dark">{'Name: '}</Badge>
            </h6>
            <h6>
              <Badge variant="light" className="ml-2">{labels.find(x => x.name == 'Name').value}</Badge>
            </h6>
            <AddDelStock inputTicker={inputTicker} handleList='stock' />
            <HappyShare />
          </Row>
          <Row className="ml-1">
            <h6>
              <Badge variant="dark">{'Price: '}</Badge>
            </h6>
            <h6>
              <Badge variant="light" className="ml-2">{labels.find(x => x.name == 'Price').value}</Badge>
            </h6>
            <h6>
              <Badge variant={labels.find(x => x.name == 'Price%').value >= 0 ? 'success' : 'danger'}>{convertToPercentage(labels.find(x => x.name == 'Price%').value / 100)}</Badge>
            </h6>
            <h6>
              <Badge className="ml-3" variant="dark">{'52W-L-H: '}</Badge>
            </h6>
            <h6>
              <Badge variant="light" className="ml-2">{labels.find(x => x.name == '52W-L-H').value}</Badge>
            </h6>
          </Row>
          <Row className="ml-1">
            <h6>
              <Badge variant="dark">{'Floating Shares: '}</Badge>
            </h6>
            <h6>
              <Badge variant="light" className="ml-2">{settings.floatingShareRatio}</Badge>
            </h6>
            <h6>
              <Badge variant="dark" className="ml-2">{'Market Cap.: '}</Badge>
            </h6>
            <h6>
              <Badge variant="light" className="ml-2">{labels.find(x => x.name == 'Market Cap.').value}</Badge>
            </h6>
          </Row>
          <Row className="ml-1">
            <h6>
              <Badge variant="dark">{'Industry: '}</Badge>
            </h6>
            <h6>
              <Badge variant="light" className="ml-2">{labels.find(x => x.name == 'Industry').value}</Badge>
            </h6>
          </Row>
          <Price inputTicker={inputTicker} inputMA={'ma'} />

        </Fragment>
        : <ValidTickerAlert />
  )
}

export default PriceTab

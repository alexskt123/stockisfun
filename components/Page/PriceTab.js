
import { Fragment, useState, useEffect } from 'react'
import Price from '../../components/Price'
import { priceTabLabelPairs } from '../../config/price'
import { Badge, Row } from 'react-bootstrap'
import AddDelStock from '../../components/FireUI/AddDelStock'

function PriceTab({ inputSettings }) {

  const [settings, setSettings] = useState({ ...inputSettings })
  const [labels, setLabels] = useState([...priceTabLabelPairs])

  useEffect(async () => {
    setSettings(inputSettings)
    setLabels(priceTabLabelPairs.map(item => {
      return {
        'name': item.name,
        'value': ({ ...inputSettings }.basics.tableData.filter(x => x.find(x => x) == item.name).find(x => x) || [])[1]
      }
    }))
  }, [inputSettings])

  return (
    <Fragment>
      <Row className="ml-1 mt-1">
        <h6>
          <Badge variant="dark">{'Name: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">{labels.find(x => x.name == 'Name').value}</Badge>
        </h6>
        <AddDelStock inputTicker={settings.inputTickers.find(x => x)} />
      </Row>
      <Row className="ml-1">
        <h6>
          <Badge variant="dark">{'Price: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">{labels.find(x => x.name == 'Price').value}</Badge>
        </h6>
        <h6>
          <Badge className="ml-3" variant="dark">{'52W-L-H: '}</Badge>
        </h6>
        <h6>
          <Badge variant="light" className="ml-2">{labels.find(x => x.name == '52W-Low-High').value}</Badge>
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
      <Price inputTicker={settings.inputTickers.find(x => x)} />

    </Fragment>
  )
}

export default PriceTab

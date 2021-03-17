
import { Fragment, useState, useEffect } from 'react'
import { sortTableItem } from '../../../lib/commonFunction'
import StockInfoTable from '../../Page/StockInfoTable'
import { etfListSettings } from '../../../config/stock'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

function ETFList({ inputSettings }) {

  const [settings, setSettings] = useState({ ...etfListSettings })
  const [ascSort, setAscSort] = useState(false)

  const handleSettings = (inputSettings) => {
    setSettings(inputSettings)
  }

  useEffect(() => {
    clearItems()
    handleSettings(inputSettings)
  }, [inputSettings])

  const sortItem = async (index) => {
    setSettings({
      ...settings,
      etfList: { ...settings.etfList, tableData: await sortTableItem(settings.etfList.tableData, index, ascSort) }
    })
    setAscSort(!ascSort)
  }

  const clearItems = () => {
    setSettings({ ...etfListSettings })
  }

  return (
    <Fragment>
      <Row className="ml-1 mt-3">
        <h5>
          <Badge variant="dark">{'No. of ETF Count: '}</Badge>
        </h5>
        <h5>
          <Badge variant="light" className="ml-2">{settings.etfCount}</Badge>
        </h5>
      </Row>
      <StockInfoTable tableSize="sm" striped={true} tableHeader={settings.etfList.tableHeader} tableData={settings.etfList.tableData} sortItem={sortItem} />
    </Fragment>
  )
}

export default ETFList

import React, { Fragment, useState, useEffect } from 'react'
import useSWR from 'swr'

import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'

import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import moment from 'moment'
import { millify, convertToPercentage, randVariant } from '../../lib/commonFunction'

const useTimestamp = (trigger) => {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    setTimestamp(() => moment().format('H:mm:ss'))
  }, [trigger])

  return timestamp
}

export default function SWRTable({ requests, options }) {
  const { tableHeader, tableSize, striped, bordered, SWROptions } = options

  const [tableData, setTableData] = useState([])
  const [reactiveTableHeader, setReactiveTableHeader] = useState(tableHeader)

  const timestamp = useTimestamp(tableData)

  const handleTableData = data => {
    const newData = { ...data }
    const newTableData = [...tableData]

    const idx = tableData.findIndex(x => x.symbol === newData.symbol)
    if (idx > -1) {
      newTableData[idx] = newData
    } else {
      newTableData.push(newData)
    }

    setTableData(newTableData)
  }

  useEffect(() => {
    const newReactiveTableHeader = tableHeader
      .map(header => ({
        ...header,
        show: tableData.some(x => x[header.item])
      }))
      .filter(x => x.show)

    setReactiveTableHeader(newReactiveTableHeader)
  }, [tableData])

  return (
    <Fragment>
      <Row className="justify-content-center">
        <h5><Badge className="mt-3" variant="info">{`Last Update: ${timestamp}`}</Badge></h5>
      </Row>
      <Table
        striped={striped ? true : false}
        bordered={bordered ? true : false}
        hover
        size={tableSize ? tableSize : 'md'}
        className="pl-3 mt-1"
        responsive
      >
        <thead>
          <tr>
            {reactiveTableHeader
              .map((header, index) => (
                // @ts-ignore
                <th className={header.className} style={(header.style)} key={index} >{header.label}</th>)
              )}
          </tr>
        </thead>
        <tbody>
          {requests.map(x => (
            <tr key={x.key}>
              < SWRTableRow request={x.request} tableHeader={reactiveTableHeader} handleTableData={handleTableData} options={SWROptions} ></SWRTableRow>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment >
  )
}

function SWRTableRow({ request, tableHeader, handleTableData, options = {} }) {
  const fetcher = (input) => fetch(input).then(res => res.json())

  const { data } = useSWR(request, fetcher, options)

  useEffect(() => {
    if (data) handleTableData(data)
  }, [data])

  if (!data) return <td colSpan={tableHeader.length}><LoadingSpinner /></td>

  return (
    <Fragment>
      {tableHeader.map(header => (
        <td style={header.style} key={header.item}>{getCell(data, header)}</td>
      ))}
    </Fragment>
  )
}

function getCellColor(property, value) {
  return property === 'netChange' ? value < 0 ? 'red' : value > 0 ? 'green' : 'black' : 'black'
}

function getFormattedValue(format, value) {
  return format && format == '%' ? `${convertToPercentage(value / 100)}`
    : format && format == 'H:mm:ss' && value ? moment(value * 1000).format('H:mm:ss')
      : format && format == 'millify' ? millify(value)
        : format && format == 'Badge' ? <Badge style={{['minWidth']: '3rem'}} variant={randVariant()}>{value}</Badge>
          : value ? value : 'N/A'
}

function getCell(data, header) {

  const newData = {
    value: data[header.item],
    property: header.property,
    format: header.format
  }

  return <Fragment><span style={{ color: getCellColor(newData.property, newData.value) }}>{getFormattedValue(newData.format, newData.value)}</span></Fragment>
}

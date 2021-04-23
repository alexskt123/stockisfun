import React, { Fragment, useState, useEffect } from 'react'
import useSWR from 'swr'

import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import { GrDocumentCsv } from 'react-icons/gr'

import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import moment from 'moment'
import { millify, convertToPercentage, randVariant, indicatorVariant } from '../../lib/commonFunction'
import { exportToFile } from '../../lib/exportToFile'

const useTimestamp = (trigger) => {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    setTimestamp(() => moment().format('H:mm:ss'))
  }, [trigger])

  return timestamp
}

export default function SWRTable({ requests, options }) {
  const { tableFirstHeader, tableHeader, tableSize, striped, bordered, viewTickerDetail, SWROptions, exportFileName } = options

  const [tableData, setTableData] = useState([])
  const [reactiveTableHeader, setReactiveTableHeader] = useState(tableHeader)
  const [ascSort, setAscSort] = useState(true)
  const [sortedRequests, setSortedRequests] = useState(requests)

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

  const sortTableItem = (id) => {
    const sortedRequests = [...requests].sort(function (a, b) {

      const bf = (tableData.find(x => x.symbol === a.key)[id] || '').toString().replace(/\+|%/gi, '')
      const af = (tableData.find(x => x.symbol === b.key)[id] || '').toString().replace(/\+|%/gi, '')
      if (isNaN(bf))
        return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)
      else
        return ascSort ? bf - af : af - bf

    })

    setSortedRequests(sortedRequests)
    setAscSort(!ascSort)
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


  useEffect(() => {
    setSortedRequests(requests)
  }, [requests])

  return (
    <Fragment>
      <Row className="justify-content-center mt-2" style={{ display: 'flex', alignItems: 'center' }} >
        <h5><Badge variant="info">{`Last Update: ${timestamp}`}</Badge></h5>
        <h5>
          <Button className="ml-1" size="sm" variant="warning" style={{ display: 'flex', alignItems: 'center' }} onClick={() => exportToFile(reactiveTableHeader.map(item => item.label), tableData.map(item => reactiveTableHeader.map(header => item[header.item])), exportFileName)}>
            <GrDocumentCsv />
          </Button>
        </h5>
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
          <tr key={'tableFirstHeader'}>
            {tableFirstHeader ?
              tableFirstHeader.map((item, index) => (
                <th key={index} style={item.style} >{item.label}</th>
              ))
              : null}
          </tr>
          <tr>
            {reactiveTableHeader
              .map((header, index) => (
                // @ts-ignore
                <th onClick={() => sortTableItem(header.item)} className={header.className} style={(header.style)} key={index} >{header.label}</th>)
              )}
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map(x => (
            <tr key={x.key}>
              < SWRTableRow request={x.request} tableHeader={reactiveTableHeader} handleTableData={handleTableData} viewTickerDetail={viewTickerDetail} options={SWROptions} ></SWRTableRow>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment >
  )
}

function SWRTableRow({ request, tableHeader, handleTableData, viewTickerDetail, options = {} }) {
  const fetcher = (input) => fetch(input).then(res => res.json())

  const { data } = useSWR(request, fetcher, options)

  useEffect(() => {
    if (data) handleTableData(data)
  }, [data])

  if (!data) return <td colSpan={tableHeader.length}><LoadingSpinner /></td>

  return (
    <Fragment>
      {tableHeader.map(header => (
        <td style={header.style} key={header.item} onClick={() => viewTickerDetail ? viewTickerDetail(data) : null}>{getCell(data, header)}</td>
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
        : format && format == 'Badge' ? <Badge style={{ ['minWidth']: '3rem' }} variant={randVariant(value)}>{value}</Badge>
          : format && format == 'IndicatorVariant' ? <Badge style={{ ['minWidth']: '3rem' }} variant={indicatorVariant(value)}>{value}</Badge>
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

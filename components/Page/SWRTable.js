import React, { Fragment, useState, useEffect } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import { GrDocumentCsv } from 'react-icons/gr'
import AnimatedNumber from 'animated-number-react'

import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import moment from 'moment'
import {
  millify,
  roundTo,
  toInteger,
  convertToPercentage,
  randVariant,
  indicatorVariant,
  getRedColor,
  getGreenColor,
  getDefaultColor
} from '../../lib/commonFunction'
import { exportToFile } from '../../lib/exportToFile'

import useDarkMode from 'use-dark-mode'

const Table = dynamic(
  () => {
    return import('react-bootstrap/Table')
  },
  { ssr: false }
)

const useTimestamp = trigger => {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    setTimestamp(() => moment().format('H:mm:ss'))
  }, [trigger])

  return timestamp
}

export default function SWRTable({ requests, options }) {
  const {
    tableFirstHeader,
    tableHeader,
    tableSize,
    striped,
    bordered,
    viewTickerDetail,
    SWROptions,
    exportFileName
  } = options

  const [tableData, setTableData] = useState([])
  const [reactiveTableHeader, setReactiveTableHeader] = useState(tableHeader)
  const [ascSort, setAscSort] = useState(true)
  const [sortedRequests, setSortedRequests] = useState(requests)

  const timestamp = useTimestamp(tableData)
  const darkMode = useDarkMode(false)

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

  const sortTableItem = id => {
    const sortedRequests = [...requests].sort(function (a, b) {
      const bfdata = tableData.find(x => x.symbol === a.key)
      const afdata = tableData.find(x => x.symbol === b.key)

      const bf = (bfdata && bfdata[id] ? bfdata[id] : '')
        .toString()
        .replace(/\+|%/gi, '')
      const af = (afdata && afdata[id] ? afdata[id] : '')
        .toString()
        .replace(/\+|%/gi, '')
      if (isNaN(bf))
        return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)
      else return ascSort ? bf - af : af - bf
    })

    setSortedRequests(sortedRequests)
    setAscSort(!ascSort)
  }

  const getStyle = (item, darkMode) => {
    const darkModeStyle =
      item.style && item.style.backgroundColor && darkMode
        ? { backgroundColor: '#343a40' }
        : {}
    return Object.assign({ ...(item.style || {}) }, darkModeStyle)
  }

  useEffect(() => {
    const newReactiveTableHeader = tableHeader
      .map(header => ({
        ...header,
        show: tableData.some(x => x[header.item])
      }))
      .filter(x => x.show)

    setReactiveTableHeader(newReactiveTableHeader)
  }, [tableData, tableHeader])

  useEffect(() => {
    setSortedRequests(requests)
  }, [requests])

  return (
    <Fragment>
      <Row
        className="justify-content-center mt-2"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <h5>
          <Badge variant="info">{`Last Update: ${timestamp}`}</Badge>
        </h5>
        <h5>
          <Button
            className="ml-1"
            size="sm"
            variant="warning"
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() =>
              exportToFile(
                reactiveTableHeader.map(item => item.label),
                tableData.map(item =>
                  reactiveTableHeader.map(header => item[header.item])
                ),
                exportFileName
              )
            }
          >
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
        variant={darkMode.value ? 'dark' : 'light'}
      >
        <thead>
          <tr key={'tableFirstHeader'}>
            {tableFirstHeader
              ? tableFirstHeader.map((item, index) => (
                  <th key={index} style={getStyle(item, darkMode.value)}>
                    <h5>
                      <Badge variant="light">{item.label}</Badge>
                    </h5>
                  </th>
                ))
              : null}
          </tr>
          <tr>
            {reactiveTableHeader.map((header, index) => (
              // @ts-ignore
              <th
                onClick={() => sortTableItem(header.item)}
                style={getStyle(header, darkMode.value)}
                key={index}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map(x => (
            <tr key={x.key}>
              <SWRTableRow
                darkMode={darkMode.value}
                getStyle={getStyle}
                request={x.request}
                tableHeader={reactiveTableHeader}
                handleTableData={handleTableData}
                viewTickerDetail={viewTickerDetail}
                options={SWROptions}
              ></SWRTableRow>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

function SWRTableRow({
  darkMode,
  getStyle,
  request,
  tableHeader,
  handleTableData,
  viewTickerDetail,
  options = {}
}) {
  const fetcher = input => fetch(input).then(res => res.json())

  const { data } = useSWR(request, fetcher, options)

  useEffect(() => {
    if (data) handleTableData(data)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (!data)
    return (
      <td colSpan={tableHeader.length}>
        <LoadingSpinner />
      </td>
    )

  return (
    <Fragment>
      {tableHeader.map(header => (
        <td
          style={getStyle(header, darkMode)}
          key={header.item}
          onClick={() => (viewTickerDetail ? viewTickerDetail(data) : null)}
        >
          {getCell(data, header, darkMode)}
        </td>
      ))}
    </Fragment>
  )
}

function getCellColor(property, value, darkMode) {
  return property === 'netChange'
    ? roundTo(value) < 0
      ? getRedColor(darkMode)
      : roundTo(value) > 0
      ? getGreenColor(darkMode)
      : getDefaultColor(darkMode)
    : getDefaultColor(darkMode)
}

function getFormattedValue(format, value) {
  return format && format == '%' ? (
    <AnimatedNumber
      value={value}
      formatValue={value => convertToPercentage(value / 100)}
    />
  ) : format && format == 'H:mm:ss' && value ? (
    moment(value * 1000).format('H:mm:ss')
  ) : format && format == 'millify' ? (
    <AnimatedNumber value={value} formatValue={millify} />
  ) : format && format == 'roundTo' ? (
    <AnimatedNumber value={value} formatValue={roundTo} />
  ) : format && format == 'toInteger' ? (
    <AnimatedNumber value={value} formatValue={toInteger} />
  ) : format && format == 'Badge' ? (
    <Badge style={{ ['minWidth']: '3rem' }} variant={randVariant(value)}>
      {value}
    </Badge>
  ) : format && format == 'IndicatorVariant' ? (
    <Badge style={{ ['minWidth']: '3rem' }} variant={indicatorVariant(value)}>
      {value}
    </Badge>
  ) : value ? (
    value
  ) : (
    'N/A'
  )
}

function getCell(data, header, darkMode) {
  const newData = {
    value: data[header.item],
    property: header.property,
    format: header.format
  }

  return (
    <Fragment>
      <span
        style={{
          color: getCellColor(newData.property, newData.value, darkMode)
        }}
      >
        {getFormattedValue(newData.format, newData.value)}
      </span>
    </Fragment>
  )
}

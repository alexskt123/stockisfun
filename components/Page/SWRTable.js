import React, { Fragment, useState, useEffect } from 'react'

import AnimatedNumber from 'animated-number-react'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { GrDocumentCsv } from 'react-icons/gr'
import useSWR from 'swr'
import useDarkMode from 'use-dark-mode'

import LoadingSkeleton from '@/components/Loading/LoadingSkeleton'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import { fetcher } from '@/config/settings'
import { exportToFile } from '@/lib/commonFunction'
import {
  millify,
  roundTo,
  toInteger,
  convertToPercentage,
  randVariant,
  indicatorVariant,
  getRedColor,
  getGreenColor,
  getDefaultColor,
  hasProperties
} from '@/lib/commonFunction'
import { useMobile } from '@/lib/hooks/useMobile'

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
    SWROptions,
    exportFileName
  } = options

  const [tableData, setTableData] = useState([])
  const [reactiveTableHeader, setReactiveTableHeader] = useState(tableHeader)
  const [ascSort, setAscSort] = useState(true)
  const [sortedRequests, setSortedRequests] = useState(requests)

  const timestamp = useTimestamp(tableData)
  const darkMode = useDarkMode(false)
  const router = useRouter()
  const isMobile = useMobile()

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

      const bf = ((hasProperties(bfdata, [id]) && bfdata[id]) || '')
        .toString()
        .replace(/\+|%/gi, '')
      const af = ((hasProperties(afdata, [id]) && afdata[id]) || '')
        .toString()
        .replace(/\+|%/gi, '')
      if (isNaN(bf))
        return (ascSort && af.localeCompare(bf)) || bf.localeCompare(af)
      else return (ascSort && bf - af) || af - bf
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
      .filter(x => !isMobile || (isMobile && !x?.hideInMobile))

    setReactiveTableHeader(newReactiveTableHeader)
  }, [tableData, tableHeader, isMobile])

  useEffect(() => {
    setSortedRequests(requests)
  }, [requests])

  if (requests.length === 0) return null

  return (
    <Fragment>
      {exportFileName && (
        <Row
          className="justify-content-center mt-2"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <HeaderBadge
            headerTag={'h5'}
            title={`Last Update: ${timestamp}`}
            badgeProps={{ bg: 'info' }}
          />
          <h5>
            <Button
              className="ms-1"
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
      )}
      <Table
        striped={striped}
        bordered={bordered}
        hover
        size={tableSize || 'md'}
        className="pl-3 mt-1"
        responsive
        variant={darkMode.value ? 'dark' : 'light'}
      >
        <thead>
          <tr key={'tableFirstHeader'}>
            {tableFirstHeader?.map((item, index) => (
              <th key={index} style={getStyle(item, darkMode.value)}>
                <HeaderBadge
                  headerTag={'h5'}
                  title={item.label}
                  badgeProps={{ bg: 'light', text: 'dark' }}
                />
              </th>
            ))}
          </tr>
          <tr>
            {reactiveTableHeader?.map((header, index) => (
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
                options={SWROptions}
                colSpan={tableHeader.length}
                router={router}
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
  options = {},
  colSpan,
  router
}) {
  // WIP - temporary solution until all API structure is synchronized
  const { data: dataRes } = useSWR(request, fetcher, options)
  const data = dataRes?.result || dataRes

  useEffect(() => {
    data && handleTableData(data)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (!data) {
    return (
      <td colSpan={colSpan}>
        <LoadingSkeleton />
      </td>
    )
  }

  return (
    <Fragment>
      {tableHeader.map(header => (
        <td
          onClick={() =>
            hasProperties(header, ['onClick']) && header.onClick(data, router)
          }
          style={getStyle(header, darkMode)}
          key={header.item}
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

function getFormattedValue(format, value, className) {
  const randVar = randVariant(value)
  const indVar = indicatorVariant(value)

  return format === '%' ? (
    <AnimatedNumber
      value={value}
      formatValue={value => convertToPercentage(value / 100)}
    />
  ) : format === 'H:mm:ss' && value ? (
    moment(value * 1000).format('H:mm:ss')
  ) : format === 'millify' ? (
    <AnimatedNumber value={value} formatValue={millify} />
  ) : format === 'roundTo' ? (
    <AnimatedNumber value={value} formatValue={roundTo} />
  ) : format === 'toInteger' ? (
    <AnimatedNumber value={value} formatValue={toInteger} />
  ) : format === 'Badge' ? (
    <Badge
      className={className}
      style={{ ['minWidth']: '3rem' }}
      bg={randVar}
      text={randVar === 'light' ? 'dark' : null}
    >
      {value}
    </Badge>
  ) : format === 'IndicatorVariant' ? (
    <Badge
      className={className}
      style={{ ['minWidth']: '3rem' }}
      bg={indVar}
      text={indVar === 'light' ? 'dark' : null}
    >
      {value}
    </Badge>
  ) : (
    value || 'N/A'
  )
}

function getCell(data, header, darkMode) {
  const newData = {
    value: data[header.item],
    property: header.property,
    format: header.format,
    className: header?.className
  }

  return (
    <Fragment>
      <span
        style={{
          color: getCellColor(newData.property, newData.value, darkMode)
        }}
      >
        {getFormattedValue(newData.format, newData.value, newData.className)}
      </span>
    </Fragment>
  )
}

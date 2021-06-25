import { Fragment } from 'react'
import Badge from 'react-bootstrap/Badge'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useDarkMode from 'use-dark-mode'

import {
  getRedColor,
  getGreenColor,
  getDefaultColor
} from '../../lib/commonFunction'

const Table = dynamic(
  () => {
    return import('react-bootstrap/Table')
  },
  { ssr: false }
)

const getItemData = item => {
  return typeof item == 'object' && item && item.data ? item.data : item
}

const getCellColor = (item, darkMode) => {
  const itemData = getItemData(item)
  if (item && item.style && item.style === 'green-red') {
    const cur = (item.data || '').toString().replace(/%/, '')
    return cur < 0
      ? { color: getRedColor(darkMode) }
      : cur > 0
      ? { color: getGreenColor(darkMode) }
      : { color: getDefaultColor(darkMode) }
  } else if ((itemData || '').toString().replace(/%/, '') < 0)
    return { color: getRedColor(darkMode) }
  else return { color: getDefaultColor(darkMode) }
}

const getCellItem = item => {
  const itemData = getItemData(item)
  if ((itemData || '').toString().match(/http:/gi))
    return (
      <a href={itemData} target="_blank" rel="noopener noreferrer">
        {itemData}
      </a>
    )
  else if (typeof item == 'object' && item && item.data && item.link) {
    return (
      <Link href={item.link}>
        <a>
          <u>{itemData}</u>
        </a>
      </Link>
    )
  } else return itemData
}

const checkCanClick = (item, cellClick) => {
  const itemData = getItemData(item)
  cellClick ? cellClick(itemData) : null
}

const sticky = {
  backgroundColor: '#f0f0f0',
  left: 0,
  position: 'sticky',
  zIndex: '997'
}

function StockInfoTable({
  tableFirstHeader,
  tableHeader,
  tableData,
  tableDataSkipRow,
  sortItem,
  cellClick,
  tableSize,
  striped
}) {
  const darkMode = useDarkMode(false)

  return (
    <Fragment>
      <Table
        striped={striped ? true : false}
        bordered
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
                  <th style={index == 0 ? sticky : {}} key={index}>
                    <h5>
                      <Badge variant="light">{item}</Badge>
                    </h5>
                  </th>
                ))
              : null}
          </tr>
          <tr key={'tableHeader'}>
            {tableHeader
              ? tableHeader.map((item, index) => (
                  <th
                    style={
                      index == 0
                        ? Object.assign(
                            { ...sticky },
                            darkMode.value ? { backgroundColor: '#343a40' } : {}
                          )
                        : {}
                    }
                    onClick={() => {
                      if (sortItem) sortItem(index)
                    }}
                    key={index}
                  >
                    {item}
                  </th>
                ))
              : null}
          </tr>
        </thead>
        <tbody>
          {tableData
            ? tableData.map((item, index) => (
                <Fragment key={index}>
                  <tr>
                    {item.map((xx, yy) => (
                      <td
                        onClick={() => {
                          if (cellClick) checkCanClick(item, cellClick)
                        }}
                        style={
                          yy == 0
                            ? Object.assign(
                                { ...sticky },
                                darkMode.value
                                  ? { backgroundColor: '#343a40' }
                                  : {}
                              )
                            : {}
                        }
                        key={`${index}${yy}`}
                      >
                        <span style={getCellColor(xx, darkMode.value)}>
                          {getCellItem(xx)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {tableDataSkipRow
                    ? tableDataSkipRow
                        .filter(x => item.find(xx => xx && xx.includes(x)))
                        .map((_item, idx) => {
                          return (
                            <tr key={idx}>
                              <td />
                            </tr>
                          )
                        })
                    : null}
                </Fragment>
              ))
            : null}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default StockInfoTable

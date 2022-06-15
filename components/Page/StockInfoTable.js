import { Fragment } from 'react'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useDarkMode from 'use-dark-mode'

import HeaderBadge from '@/components/Parts/HeaderBadge'
import {
  getRedColor,
  getGreenColor,
  getDefaultColor,
  hasProperties,
  toNumber
} from '@/lib/commonFunction'

const Table = dynamic(
  () => {
    return import('react-bootstrap/Table')
  },
  { ssr: false }
)

const getItemData = item => {
  return item?.data || item || ''
}

const getCellColor = (item, darkMode) => {
  const number = toNumber(getItemData(item))
  const getColor =
    number < 0
      ? getRedColor
      : item?.style === 'green-red' && number > 0
      ? getGreenColor
      : getDefaultColor

  return { color: getColor(darkMode) }
}

const getCellItem = item => {
  const linkProperties = ['data', 'link']

  const itemData = getItemData(item)
  const element = itemData.toString().match(/http:/gi) ? (
    <a href={itemData} target="_blank" rel="noopener noreferrer">
      {itemData}
    </a>
  ) : hasProperties(item, linkProperties) ? (
    <Link href={item.link}>
      <a>
        <u>{itemData}</u>
      </a>
    </Link>
  ) : (
    itemData
  )
  return element
}

const checkCanClick = (router, item, cellClick) => {
  const itemData = getItemData(item)
  cellClick && cellClick(router, itemData)
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
  const router = useRouter()

  return (
    <Fragment>
      <Table
        striped={striped}
        bordered
        hover
        size={tableSize || 'md'}
        className="pl-3 mt-1"
        responsive
        variant={darkMode.value ? 'dark' : 'light'}
      >
        <thead>
          <tr key={'tableFirstHeader'}>
            {tableFirstHeader?.map((item, index) => (
              <th style={index === 0 ? sticky : {}} key={index}>
                <HeaderBadge
                  headerTag={'h5'}
                  title={item}
                  badgeProps={{ bg: 'light' }}
                />
              </th>
            ))}
          </tr>
          <tr key={'tableHeader'}>
            {tableHeader?.map((item, index) => (
              <th
                style={
                  index === 0
                    ? Object.assign(
                        { ...sticky },
                        darkMode.value ? { backgroundColor: '#343a40' } : {}
                      )
                    : {}
                }
                onClick={() => {
                  sortItem && sortItem(index)
                }}
                key={index}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item, index) => (
            <Fragment key={index}>
              <tr>
                {item.map((xx, yy) => (
                  <td
                    onClick={() => {
                      cellClick && checkCanClick(router, item, cellClick)
                    }}
                    style={
                      yy === 0
                        ? Object.assign(
                            { ...sticky },
                            darkMode.value ? { backgroundColor: '#343a40' } : {}
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
                ?.filter(x => item.find(xx => xx && xx.includes(x)))
                ?.map((_item, idx) => {
                  return (
                    <tr key={idx}>
                      <td />
                    </tr>
                  )
                })}
            </Fragment>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default StockInfoTable

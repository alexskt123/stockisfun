import React, { Fragment, useState, useEffect } from 'react'
import useSWR from 'swr'

import Table from 'react-bootstrap/Table'

import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import moment from 'moment'

const useTimestamp = (trigger) => {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    setTimestamp(() => moment().format('H:mm:ss'))
  }, [trigger])

  return timestamp
}

export default function SWRTable({ requests, options }) {
  const { tableHeader, tableSize, striped, SWROptions } = options

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
      <h3>Last Update: {timestamp}</h3>
      <Table
        striped={striped ? true : false}
        bordered
        hover
        size={tableSize ? tableSize : 'md'}
        className="pl-3 mt-3"
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
        <td style={header.style} key={header.item}>{data[header.item]}</td>
      ))}
    </Fragment>
  )
}

import React, { Fragment, useState, useEffect } from 'react'
import useSWR from 'swr'

import Table from 'react-bootstrap/Table'

import LoadingSpinner from '../../components/Loading/LoadingSpinner'

export default function SWRTable({ requests, options }) {
  const { tableHeader, tableSize, striped, SWROptions, } = options

  return (
    <Fragment>
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
            {tableHeader.map((header, index) => (
              // @ts-ignore
              <th className={header.className} style={(header.style)} key={index} >{header.label}</th>)
            )}
          </tr>
        </thead>
        <tbody>
          {requests.map(x => (
            <tr key={x.key}>
              < SWRTableRow request={x.request} tableHeader={tableHeader} options={SWROptions} ></SWRTableRow>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment >
  )
}

function SWRTableRow({ request, tableHeader, options = {} }) {
  const fetcher = (input) => fetch(input).then(res => res.json())

  const { data } = useSWR(request, fetcher, options)

  if (!data) return <td><LoadingSpinner /></td>

  return (
    <Fragment>
      {tableHeader.map(header => (
        <td style={header.style} key={header.item}>{data[header.item]}</td>
      ))}
    </Fragment>
  )
}

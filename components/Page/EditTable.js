import { Fragment, useState, useEffect } from 'react'

import { useBgColor } from '@/lib/hooks/useBgColor'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default function EditTable({ tableHeader, data, onUpdate }) {
  const tableVariant = useBgColor('light', 'dark')
  const formControlBgColor = useBgColor('white', 'grey')
  const formControlColor = useBgColor('black', 'white')

  const [inputData, setInputData] = useState(data)

  useEffect(() => {
    setInputData(data)
  }, [data])

  const handleDataChange = (e, rowIdx, itemKey) => {
    const newData = inputData.map((item, idx) => {
      const newItem =
        idx !== rowIdx
          ? item
          : {
              ...item,
              [itemKey]: e.target.value
            }
      return newItem
    })
    setInputData(newData)
  }

  const onAdd = () => {
    const newData = tableHeader.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.item]: ''
      }
    }, {})
    setInputData([...inputData, newData])
  }

  const onDelete = rowIdx => {
    setInputData(inputData.filter((_x, idx) => idx !== rowIdx))
  }

  const onReset = () => {
    setInputData(data)
  }

  return (
    <Fragment>
      <Form inline>
        <Table
          bordered
          hover
          size="sm"
          className="pl-3 mt-3"
          responsive
          variant={tableVariant}
        >
          <thead>
            <tr>
              {tableHeader.map((header, index) => (
                // @ts-ignore
                <th key={index}>{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inputData.map((rowItem, rowIdx) => {
              return (
                <Fragment key={rowIdx}>
                  <tr>
                    {tableHeader.map((header, itemIdx) => {
                      return (
                        <td key={itemIdx}>
                          <Form.Group>
                            <Form.Control
                              className="w-100"
                              size="sm"
                              type={header.type}
                              style={{
                                backgroundColor: formControlBgColor,
                                color: formControlColor
                              }}
                              value={rowItem[header.item]}
                              onChange={e =>
                                handleDataChange(e, rowIdx, header.item)
                              }
                            />
                          </Form.Group>
                        </td>
                      )
                    })}
                    <td>
                      <Button
                        onClick={() => onDelete(rowIdx)}
                        size="sm"
                        variant="danger"
                      >
                        {'Delete'}
                      </Button>
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </Table>
        <ButtonGroup>
          <Button onClick={() => onAdd()} size="sm" variant="warning">
            {'Add Record'}
          </Button>
          <Button
            onClick={() => onUpdate(inputData)}
            size="sm"
            variant="success"
          >
            {'Update'}
          </Button>
          <Button onClick={() => onReset()} size="sm" variant="secondary">
            {'Reset'}
          </Button>
        </ButtonGroup>
      </Form>
    </Fragment>
  )
}

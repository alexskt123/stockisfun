import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'

import CustomSpinner from './CustomSpinner'

function LoadingSpinner() {
  const spinners = [...Array(3)].map(_item => '')

  return (
    <Fragment>
      <div style={{ minWidth: '12rem' }}>
        <Button variant="light" disabled>
          {spinners.map((_item, idx) => {
            return <CustomSpinner key={`${idx}`} />
          })}
          <Badge variant="dark" className="ml-2">
            {'Loading'}
          </Badge>
          {spinners.map((_item, idx) => {
            return <CustomSpinner key={`${idx}`} />
          })}
        </Button>
      </div>
    </Fragment>
  )
}

export default LoadingSpinner

import { Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import CustomSpinner from './CustomSpinner'

function LoadingSpinner() {

  const spinners = [...Array(3)].map(_item => '')

  return (
    <Fragment>
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
    </Fragment>

  )
}

export default LoadingSpinner
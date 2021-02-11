import { Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import CustomSpinner from './CustomSpinner'

function LoadingSpinner() {

  const spinners = [...Array(3)].map(_item => '')

  return (
    <Fragment>
      <Button variant="dark" disabled>
        {spinners.map((item, idx) => {
          return <CustomSpinner key={`${idx}`} />
        })}
        {'Loading'}
        {spinners.map((item, idx) => {
          return <CustomSpinner key={`${idx}`} />
        })}
      </Button>
    </Fragment>

  )
}

export default LoadingSpinner
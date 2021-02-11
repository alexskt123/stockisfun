import Spinner from 'react-bootstrap/Spinner'

export default function CustomSpinner () {

  const spinnerConfig = {
    as:'span',
    animation:'grow',
    size:'sm',
    role:'status',
    ['aria-hidden']: 'true'
  }

  return (
    <Spinner {...spinnerConfig}  />
  )
}

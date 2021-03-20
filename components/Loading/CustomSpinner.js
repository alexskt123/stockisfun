import Spinner from 'react-bootstrap/Spinner'

export default function CustomSpinner () {

  const spinnerConfig = {
    as:'span',
    animation:'border',
    size:'sm',
    role:'status',
    ['aria-hidden']: 'true'
  }

  return (
    <Spinner className="ml-2" {...spinnerConfig}  />
  )
}

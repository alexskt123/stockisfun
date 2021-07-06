import { Fragment, useState } from 'react'

export default function Wiggle({ children }) {
  const [wiggle, setWiggle] = useState(true)

  return (
    <Fragment>
      <div
        className={'wiggle'}
        onClick={() => {
          setWiggle(false)
        }}
        wiggle={`${wiggle}`}
      >
        {{ ...children }}
      </div>
    </Fragment>
  )
}

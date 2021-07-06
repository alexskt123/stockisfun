import { Fragment, useState } from 'react'

import styles from 'styles/wiggle.module.css'

export default function Wiggle({ children }) {
  const [wiggle, setWiggle] = useState(true)

  return (
    <Fragment>
      <div
        className={styles.wiggle}
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

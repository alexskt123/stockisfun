import { Fragment } from 'react'
import Goo from 'gooey-react'

function GooeySpinner() {

  return (
    <Fragment>
      <Goo>
        <svg
          role="img"
          aria-label="Example of a gooey effect"
          width="300" height="60"
        >
          <g>
            <circle
              cx="25%"
              cy="50%"
              r="20"
              fill="darkorchid"
              style={{ animation: 'sway 0.4s ease-out infinite alternate' }}
            />
            <circle
              cx="45%"
              cy="50%"
              r="20"
              fill="blueviolet"
              style={{
                animation: 'sway 0.4s -0.4s ease-out infinite alternate',
              }}
            />
            <circle
              cx="65%"
              cy="50%"
              r="20"
              fill="rebeccapurple"
              style={{ animation: 'sway 0.4s ease-out infinite alternate' }}
            />
          </g>
        </svg>
      </Goo>
    </Fragment>

  )
}

export default GooeySpinner
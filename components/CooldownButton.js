import { Fragment, createElement } from 'react'

import Countdown from 'react-countdown'
import createPersistedState from 'use-persisted-state'

export const CooldownButton = ({
  stateKey,
  cooldownTime = 5000,
  intervalDelay = 50,
  precision = 2,
  renderOnCDing,
  renderOnCDed,
  handleClick = () => {}
}) => {
  const useCooldownState = createPersistedState(stateKey)
  const [cooldown, setCooldown] = useCooldownState(Date.now())

  const newCooldown = () => {
    handleClick()

    const newDateTime = Date.now() + cooldownTime * 1
    setCooldown(newDateTime)
  }

  const renderer = props => {
    const { completed } = props
    return completed
      ? createElement(renderOnCDed, props)
      : createElement(renderOnCDing, props)
  }

  return (
    <Fragment>
      <Countdown
        key={cooldown}
        date={cooldown}
        renderer={props => renderer({ ...props, handleClick: newCooldown })}
        intervalDelay={intervalDelay}
        precision={precision}
      />
    </Fragment>
  )
}

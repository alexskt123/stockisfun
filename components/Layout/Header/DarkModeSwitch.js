import dynamic from 'next/dynamic'

import { IconContext } from 'react-icons'
import { FiSun, FiMoon } from 'react-icons/fi'

import useDarkMode from 'use-dark-mode'

const Toggle = dynamic(
  () => {
    return import('react-toggle')
  },
  { ssr: false }
)

const DarkModeSwitch = () => {
  const darkMode = useDarkMode(false)

  return (
    <Toggle
      checked={darkMode.value}
      onChange={darkMode.toggle}
      icons={{
        checked: (
          <IconContext.Provider
            value={{ color: 'white', className: 'global-class-name' }}
          >
            <FiMoon />
          </IconContext.Provider>
        ),
        unchecked: (
          <IconContext.Provider
            value={{ color: 'white', className: 'global-class-name' }}
          >
            <FiSun />
          </IconContext.Provider>
        )
      }}
    />
  )
}

export default DarkModeSwitch

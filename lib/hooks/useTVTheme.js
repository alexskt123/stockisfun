import { useState, useEffect } from 'react'

import useDarkMode from 'use-dark-mode'

export const useTVTheme = () => {
  const darkMode = useDarkMode(false)

  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(darkMode.value ? 'dark' : 'light')
  }, [darkMode])

  return theme
}

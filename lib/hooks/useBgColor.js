import { useState, useEffect } from 'react'
import useDarkMode from 'use-dark-mode'

export const useBgColor = (light, dark) => {
  const darkMode = useDarkMode(false)

  const [color, setColor] = useState(null)

  useEffect(() => {
    setColor(darkMode.value ? dark : light)
  }, [dark, darkMode, light])

  return color
}

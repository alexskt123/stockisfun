import { useState, useEffect } from 'react'
import useDarkMode from 'use-dark-mode'

export const usebgColor = (light, dark) => {
  const darkMode = useDarkMode(false)

  const [color, setColor] = useState(null)

  useEffect(() => {
    setColor(darkMode.value ? dark : light)
  }, [darkMode])

  return color
}

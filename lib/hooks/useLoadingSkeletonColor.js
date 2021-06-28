import { useState, useEffect } from 'react'

import useDarkMode from 'use-dark-mode'

export const useLoadingSkeletonColor = ({ light, dark }) => {
  const darkMode = useDarkMode(false)

  const [color, setColor] = useState(light)

  useEffect(() => {
    setColor(darkMode.value ? dark : light)
  }, [dark, darkMode, light])

  return color
}

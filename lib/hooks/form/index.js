import { useState, useEffect } from 'react'

export const useParams = inputParams => {
  const [params, setParams] = useState({})

  useEffect(() => {
    setParams(inputParams)
  }, [inputParams])

  return [params, setParams]
}

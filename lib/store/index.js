import { createContext, useReducer } from 'react'
import { defaultUserConfig } from '../../config/settings'

const initialState = { user: { ...defaultUserConfig } }
const Store = createContext(initialState)

const { Provider } = Store

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {

    const { type, payload } = action

    switch (type) {
    case 'USER':
      return {
        ...state,
        user: { ...payload }
      }
    default:
      break
    }
  }, initialState)

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  )
}

export {
  Store,
  StateProvider
}


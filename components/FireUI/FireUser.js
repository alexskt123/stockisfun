import { useContext } from 'react'
import { auth } from '../../config/fireui-config'
import { Store } from '../../lib/store'
import { getUserInfoByUID } from '../../lib/firebaseResult'
import { defaultUserConfig } from '../../config/settings'
import moment from 'moment-business-days'

function FireUser() {

  const store = useContext(Store)
  const { state, dispatch } = store

  auth.onAuthStateChanged(async (user) => {

    if (user && state && state.user && state.user.id == '') {

      const { stockList, etfList, watchList, id } = await getUserInfoByUID(user == null ? '' : user.uid)

      const newUserConfig = {
        ...defaultUserConfig,
        id,
        uid: user.uid,
        displayName: user.displayName ? user.displayName : 'Anonymous',
        loginTime: moment().format('HH:mm:ss DD/MM/YYYY'),
        stockList,
        etfList,
        watchList
      }

      dispatch({ type: 'USER', payload: newUserConfig })
    }

  })

  return (
    ''
  )
}

export default FireUser
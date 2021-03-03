import { Fragment, useContext } from 'react'
import { addToUserList, delFromUserList, getUserInfoByUID } from '../../lib/firebaseResult'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { Store } from '../../lib/store'
import { fireToast } from '../../lib/toast'

function AddDelStock({ inputTicker, handleList }) {
  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

  const handleDispatch = async () => {
    const { stockList, etfList } = await getUserInfoByUID(user == null ? '' : user.uid)

    const newUserConfig = {
      ...user,
      stockList,
      etfList
    }

    dispatch({ type: 'USER', payload: newUserConfig })
  }

  const handleRemove = async () => {
    await delFromUserList(user.uid, inputTicker, handleList)
    await handleDispatch()

    fireToast({
      icon: 'success',
      title: 'Removed'
    })
  }

  const handleAdd = async () => {
    await addToUserList(user.uid, inputTicker, handleList)
    await handleDispatch()

    fireToast({
      icon: 'success',
      title: 'Added'
    })
  }

  return (
    <Fragment>
      {
        user.id != ''
          ? handleList == 'stock' && user.stockList.includes(inputTicker) || handleList == 'etf' && user.etfList.includes(inputTicker)
            ? <IconContext.Provider value={{ color: 'red', className: 'global-class-name' }}>
              <MdRemoveCircleOutline onClick={handleRemove} />
            </IconContext.Provider>
            : <IconContext.Provider value={{ color: 'green', className: 'global-class-name' }}>
              <MdAddCircleOutline onClick={handleAdd} />
            </IconContext.Provider>
          : null
      }
    </Fragment>
  )
}

export default AddDelStock
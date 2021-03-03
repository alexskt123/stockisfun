import { Fragment, useContext } from 'react'
import { addToUserStockList, delFromUserStockList, getUserInfoByUID } from '../../lib/firebaseResult'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { Store } from '../../lib/store'
import { fireToast } from '../../lib/toast'

function AddDelStock({ inputTicker }) {
  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

  const handleDispatch = async () => {
    const { stockList } = await getUserInfoByUID(user == null ? '' : user.uid)

    const newUserConfig = {
      ...user,
      stockList
    }

    dispatch({ type: 'USER', payload: newUserConfig })
  }

  const handleRemove = async () => {
    await delFromUserStockList(user.uid, inputTicker)
    await handleDispatch()

    fireToast({
      icon: 'success',
      title: 'Removed'
    })
  }

  const handleAdd = async () => {
    await addToUserStockList(user.uid, inputTicker)
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
          ? user.stockList.includes(inputTicker)
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
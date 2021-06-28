import { Fragment } from 'react'

import Badge from 'react-bootstrap/Badge'
import { IconContext } from 'react-icons'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md'

import {
  addToUserList,
  delFromUserList,
  useUser,
  useUserData
} from '../../lib/firebaseResult'
import { fireToast } from '../../lib/toast'

function AddDelStock({ inputTicker, handleList }) {
  const user = useUser()
  const userData = useUserData(user)

  const handleRemove = async () => {
    await delFromUserList(user.uid, inputTicker, handleList)

    fireToast({
      icon: 'success',
      title: 'Removed'
    })
  }

  const handleAdd = async () => {
    await addToUserList(user.uid, inputTicker, handleList)

    fireToast({
      icon: 'success',
      title: 'Added'
    })
  }

  return (
    <Fragment>
      {user ? (
        (handleList === 'stock' && userData?.stockList.includes(inputTicker)) ||
        (handleList === 'etf' && userData?.etfList.includes(inputTicker)) ? (
          <Badge>
            <IconContext.Provider value={{ color: 'red', size: '15px' }}>
              <MdRemoveCircleOutline
                className="cursor"
                onClick={handleRemove}
              />
            </IconContext.Provider>
          </Badge>
        ) : (
          <Badge>
            <IconContext.Provider value={{ color: 'green', size: '15px' }}>
              <MdAddCircleOutline className="cursor" onClick={handleAdd} />
            </IconContext.Provider>
          </Badge>
        )
      ) : null}
    </Fragment>
  )
}

export default AddDelStock

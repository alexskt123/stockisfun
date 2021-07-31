import { Fragment } from 'react'

import { fireToast } from '@/lib/commonFunction'
import {
  addToUserList,
  delFromUserList,
  usePersistedUser,
  useUserData
} from '@/lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import { IconContext } from 'react-icons'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md'

function AddDelStock({ inputTicker, handleList }) {
  const user = usePersistedUser()
  const userData = useUserData(user)

  const handleRemove = async () => {
    await delFromUserList(userData.docId, inputTicker, handleList)

    fireToast({
      icon: 'success',
      title: 'Removed'
    })
  }

  const handleAdd = async () => {
    await addToUserList(userData.docId, inputTicker, handleList)

    fireToast({
      icon: 'success',
      title: 'Added'
    })
  }

  return (
    <Fragment>
      {user &&
        ((handleList === 'stockList' &&
          userData?.stockList.includes(inputTicker)) ||
        (handleList === 'etfList' &&
          userData?.etfList.includes(inputTicker)) ? (
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
        ))}
    </Fragment>
  )
}

export default AddDelStock

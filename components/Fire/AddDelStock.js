import { Fragment } from 'react'

import { IconContext } from 'react-icons'
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md'

import { fireToast, hasProperties } from '@/lib/commonFunction'
import {
  addToUserList,
  delFromUserList,
  usePersistedUser,
  useUserData
} from '@/lib/firebaseResult'

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
        (hasProperties(userData, [handleList]) &&
        userData[handleList].includes(inputTicker) ? (
          <span>
            <IconContext.Provider value={{ color: 'red', size: '15px' }}>
              <MdRemoveCircleOutline
                className="cursor"
                onClick={handleRemove}
              />
            </IconContext.Provider>
          </span>
        ) : (
          <span>
            <IconContext.Provider value={{ color: 'green', size: '15px' }}>
              <MdAddCircleOutline className="cursor" onClick={handleAdd} />
            </IconContext.Provider>
          </span>
        ))}
    </Fragment>
  )
}

export default AddDelStock

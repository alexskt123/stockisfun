import { Fragment } from 'react'

import { useUser } from '@/lib/firebaseResult'
import dynamic from 'next/dynamic'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaUserCircle } from 'react-icons/fa'

const DynamicAuth = dynamic(
  () => {
    return import('@/components/Fire/FireAuth')
  },
  { ssr: false }
)

const UserDropdown = () => {
  const [user] = useUser()

  return (
    <Fragment>
      <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <FaUserCircle />
        </Dropdown.Toggle>
        <Dropdown.Menu renderOnMount={true}>
          <DynamicAuth user={user} />
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  )
}

export default UserDropdown

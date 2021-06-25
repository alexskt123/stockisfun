import { Fragment } from 'react'

import dynamic from 'next/dynamic'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaUserCircle } from 'react-icons/fa'

const DynamicAuth = dynamic(
  () => {
    return import('../../Fire/FireAuth')
  },
  { ssr: false }
)

const UserDropdown = () => {
  return (
    <Fragment>
      <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          <FaUserCircle />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <DynamicAuth />
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  )
}

export default UserDropdown

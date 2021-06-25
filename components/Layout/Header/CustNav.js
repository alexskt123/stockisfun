import Nav from 'react-bootstrap/Nav'

import CustNavItems from './CustNavItems'
import CustNavDropdownItems from './CustNavDropdownItems'

// config
import { NavDropDown, NavItems } from '../../../config/settings'

const CustNav = () => {
  return (
    <Nav className="mr-auto">
      <CustNavDropdownItems NavDropDown={NavDropDown} />
      <CustNavItems NavItems={NavItems} />
    </Nav>
  )
}

export default CustNav

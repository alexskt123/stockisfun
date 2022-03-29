import Nav from 'react-bootstrap/Nav'

import CustNavDropdownItems from './CustNavDropdownItems'
import CustNavItems from './CustNavItems'
import { NavDropDown, NavItems } from '@/config/settings'

const CustNav = () => {
  return (
    <Nav className="mr-auto">
      <CustNavDropdownItems NavDropDown={NavDropDown} />
      <CustNavItems NavItems={NavItems} />
    </Nav>
  )
}

export default CustNav

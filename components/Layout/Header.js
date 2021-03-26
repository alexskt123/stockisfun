// react, next and hooks
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
// lib
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Dropdown from 'react-bootstrap/Dropdown'
import { IconContext } from 'react-icons'
import { FaUserCircle } from 'react-icons/fa'
// config
import { NavItems, NavDropDown, iconConfig } from '../../config/settings'

const DynamicAuth = dynamic(
  () => {
    return import('../Fire/FireAuth')
  },
  { ssr: false }
)

const FireUser = dynamic(
  () => {
    return import('../Fire/FireUser')
  },
  { ssr: false }
)

function Header() {

  const router = useRouter()

  return (
    <Fragment>
      <Head>
        <title>{'Stock Is Fun'}</title>
      </Head>
      <FireUser />
      <Navbar collapseOnSelect fixed="top" bg="dark" variant="dark" expand="md" style={{ zIndex: '998!important' }}>
        <Dropdown>
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            <IconContext.Provider value={{ color: 'white', className: 'global-class-name' }}>
              <FaUserCircle />
            </IconContext.Provider>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <DynamicAuth />
          </Dropdown.Menu>
        </Dropdown>
        <Link href={'/highlight'} passHref>
          <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }}>
            <img
              {...iconConfig}
            />
            {'Stock is Fun'}
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Comparison" id="nav-dropdown">
              {NavDropDown
                .map(item => item.category)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((cat, catIdx) => {
                  return (
                    <Fragment key={`${cat}${catIdx}`}>
                      <Badge variant="dark" className='ml-1'>{cat}</Badge>
                      <NavDropdown.Divider />
                      {NavDropDown.filter(x => x.category == cat).map((item, idx) => {
                        const href = `${item.href}`
                        const active = router.asPath === href
                        return (
                          <Link key={`${cat}${idx}`} href={href} passHref>
                            <NavDropdown.Item active={active} disabled={active}>
                              {`${item.label}`}
                            </NavDropdown.Item>
                          </Link>
                        )
                      })}
                    </Fragment>
                  )
                })
              }
            </NavDropdown>
            {NavItems.map((item, idx) => {
              const href = `${item.href}`
              const active = router.asPath.split('?').find(x => x) === href
              return (
                <Link key={`${idx}`} href={href} passHref>
                  <Nav.Link active={active} disabled={active}>
                    {`${item.label}`}
                  </Nav.Link>
                </Link>
              )
            })}
          </Nav>
        </Navbar.Collapse>
        {/* <Nav>
          <NavDropdown
            title={
              <IconContext.Provider value={{ color: 'white', className: 'global-class-name' }}>
                <FaUserCircle />
              </IconContext.Provider>}
            id="nav-user">
            <DynamicAuth />
          </NavDropdown>
        </Nav> */}
      </Navbar>
    </Fragment >
  )
}

export default Header

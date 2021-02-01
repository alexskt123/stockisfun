// react, next and hooks
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
// lib
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
// config
import { NavItems } from '../config/settings'


function Header() {

  const router = useRouter()
  return (
    <Fragment>
      <Head>
        <title>{'Stock Is Fun'}</title>
      </Head>

      <Navbar collapseOnSelect fixed="top" bg="dark" variant="dark" expand="md" style={{ zIndex: '998!important' }}>
        <Navbar.Brand>
          {'StockIsFun'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {NavItems.map((item, idx) => {
              const href = `${item.href}`
              const active = router.asPath === href
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
      </Navbar>
    </Fragment >
  )
}

export default Header

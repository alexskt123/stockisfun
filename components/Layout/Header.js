// react, next and hooks
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
// lib
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
// config
import { NavItems, NavDropDown } from '../../config/settings'
import Settings from '../../config/settings'
import { Badge, NavDropdown } from 'react-bootstrap'
import { FaUserCircle } from "react-icons/fa"

import dynamic from "next/dynamic";

const DynamicAuth = dynamic(
  () => {
    return import('../FireUI/FireAuth');
  },
  { ssr: false }
);


function Header() {

  const imgConfig = {
    alt: '',
    src: Settings.LogoImgSrc,
    width: '35',
    height: '35',
    className: 'd-inline-block align-top'
  }

  const router = useRouter()
  return (
    <Fragment>
      <Head>
        <title>{'Stock Is Fun'}</title>
      </Head>

      <Navbar collapseOnSelect fixed="top" bg="dark" variant="dark" expand="md" style={{ zIndex: '998!important' }}>
        <NavDropdown title={<FaUserCircle />} id="nav-user">
          <DynamicAuth />
        </NavDropdown>
        <Navbar.Brand>
          <img
            {...imgConfig}
          />
          {'Stock is Fun'}
        </Navbar.Brand>
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
              {/* {NavDropDown.map((item, idx) => {
                const href = `${item.href}`
                const active = router.asPath === href
                return (
                  <Link key={`${idx}`} href={href} passHref>
                    <NavDropdown.Item active={active} disabled={active}>
                      {`${item.label}`}
                    </NavDropdown.Item>
                  </Link>
                )
              })} */}
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
      </Navbar>
    </Fragment >
  )
}

export default Header

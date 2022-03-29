import { Fragment } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Badge from 'react-bootstrap/Badge'
import Navbar from 'react-bootstrap/Navbar'

import CustNav from './Header/CustNav'
import DarkModeSwitch from './Header/DarkModeSwitch'
import UserDropdown from './Header/UserDropdown'
import { iconConfig } from '@/config/settings'

function Header() {
  return (
    <Fragment>
      <Head>
        <title>{'Stock Is Fun'}</title>
      </Head>
      <Navbar
        collapseOnSelect
        fixed="top"
        bg="dark"
        variant="dark"
        expand="md"
        style={{ zIndex: '998!important', padding: '0.1rem' }}
      >
        <UserDropdown />
        <Link href={'/highlight'} passHref>
          <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }}>
            <Image alt="Logo" {...iconConfig} />
            <Badge variant="dark">{'Stock is Fun'}</Badge>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <CustNav />
          <Navbar.Text>
            <DarkModeSwitch />
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  )
}

export default Header

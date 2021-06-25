/* eslint-disable jsx-a11y/alt-text */
// react, next and hooks
import { Fragment } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
// lib
import Navbar from 'react-bootstrap/Navbar'
import Badge from 'react-bootstrap/Badge'
//import Toggle from 'react-toggle'
// config
import { iconConfig } from '../../config/settings'
import UserDropdown from './Header/UserDropdown'
import DarkModeSwitch from './Header/DarkModeSwitch'
import CustNav from './Header/CustNav'

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
        style={{ zIndex: '998!important' }}
      >
        <UserDropdown />
        <Link href={'/highlight'} passHref>
          <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }}>
            <Image {...iconConfig} />
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

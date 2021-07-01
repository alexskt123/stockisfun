import { Fragment } from 'react'

import Link from 'next/link'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Row from 'react-bootstrap/Row'
import { CgViewList } from 'react-icons/cg'
import { FaUserCircle, FaList } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { RiFundsBoxLine, RiProfileLine } from 'react-icons/ri'

const SignedInDisplay = ({ user, userData, setShowSignOut }) => {
  return (
    <Fragment>
      <div className="container" style={{ minWidth: '18rem' }}>
        <Row style={{ width: 'inherit' }} className="ml-1">
          <FaUserCircle />
          <Badge variant="light">{user.displayName}</Badge>
        </Row>
        <Row
          style={{
            width: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
          className="ml-1"
        >
          <HiOutlineMail />
          <Badge variant="light">{`${user.email}`}</Badge>
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <Row>
          <Col>
            <RiProfileLine />
            <Badge className="ml-1" variant="light">
              <Link href={'/admin'}>{'Profile'}</Link>
            </Badge>
          </Col>
          <Col>
            <Badge className="ml-1" variant="light">
              <Link href={'/profile'}>{'Bought Profile'}</Link>
            </Badge>
          </Col>
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <Row>
          <Col>
            <CgViewList />
            <Badge className="ml-1" variant="light">
              <Link href={`/watchlist?query=${userData?.watchList.join(',')}`}>
                {'Watch List'}
              </Link>
            </Badge>
          </Col>
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <p style={{ width: 'inherit' }}>
          <FaList />
          <Badge className="ml-1" variant="light">
            {'Stock List'}
          </Badge>
        </p>
        <Row>
          {userData?.stockList.map((item, idx) => {
            return (
              <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                <Badge className="ml-1" key={idx} variant="light">
                  <Link href={`/stockdetail?query=${item}`}>{item}</Link>
                </Badge>
              </Col>
            )
          })}
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <p style={{ width: 'inherit' }}>
          <RiFundsBoxLine />
          <Badge className="ml-1" variant="light">
            {'ETF List'}
          </Badge>
        </p>
        <Row>
          {userData?.etfList.map((item, idx) => {
            return (
              <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                <Badge className="ml-1" key={idx} variant="light">
                  <Link href={`/etfdetail?query=${item}`}>{item}</Link>
                </Badge>
              </Col>
            )
          })}
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <p style={{ width: 'inherit' }}>
          <Badge
            as="button"
            onClick={() => setShowSignOut(true)}
            variant="danger"
          >
            {'Sign Out'}
          </Badge>
        </p>
      </div>
    </Fragment>
  )
}

export default SignedInDisplay

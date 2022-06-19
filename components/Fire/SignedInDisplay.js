import { Fragment } from 'react'

import Link from 'next/link'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Row from 'react-bootstrap/Row'
import { CgViewList } from 'react-icons/cg'
import { FaUserCircle, FaList } from 'react-icons/fa'
import { GrUserAdmin } from 'react-icons/gr'
import { HiOutlineMail } from 'react-icons/hi'
import { RiFundsBoxLine, RiProfileLine } from 'react-icons/ri'

const SignedInDisplay = ({ user, userData, setShowSignOut }) => {
  return (
    <Fragment>
      <div className="container" style={{ minWidth: '18rem' }}>
        <div style={{ width: 'inherit' }} className="ms-1">
          <FaUserCircle />
          <Badge bg="light" text="dark">
            {user.displayName}
          </Badge>
        </div>
        <div
          style={{
            width: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
          className="ms-1"
        >
          <HiOutlineMail />
          <Badge bg="light" text="dark">{`${user.email}`}</Badge>
        </div>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <Row style={{ width: 'inherit' }}>
          <Col>
            <GrUserAdmin />
            <Badge className="ms-1" bg="light" text="dark">
              <Link href={'/admin'}>{'Settings'}</Link>
            </Badge>
          </Col>
          <Col>
            <RiProfileLine />
            <Badge className="ms-1" bg="light" text="dark">
              <Link href={'/profile'}>{'Profile'}</Link>
            </Badge>
          </Col>
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <Row>
          <Col>
            <CgViewList />
            <Badge className="ms-1" bg="light" text="dark">
              <Link
                href={`/watchlist?tickers=${userData?.watchList.join(',')}`}
              >
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
          <Badge className="ms-1" bg="light" text="dark">
            {'Stock List'}
          </Badge>
        </p>
        <Row>
          {userData?.stockList.map((item, idx) => {
            return (
              <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                <Badge className="ms-1" key={idx} bg="light" text="dark">
                  <Link href={`/stockinfo?ticker=${item}&type=detail`}>
                    {item}
                  </Link>
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
          <Badge className="ms-1" bg="light" text="dark">
            {'ETF List'}
          </Badge>
        </p>
        <Row>
          {userData?.etfList.map((item, idx) => {
            return (
              <Col key={`${item}${idx}`} xs={3} sm={3} md={3} lg={4}>
                <Badge className="ms-1" key={idx} bg="light" text="dark">
                  <Link href={`/stockinfo?ticker=${item}&type=detail`}>
                    {item}
                  </Link>
                </Badge>
              </Col>
            )
          })}
        </Row>
      </div>
      <Dropdown.Divider />
      <div className="container">
        <p style={{ width: 'inherit' }}>
          <Badge as="button" onClick={() => setShowSignOut(true)} bg="danger">
            {'Sign Out'}
          </Badge>
        </p>
      </div>
    </Fragment>
  )
}

export default SignedInDisplay

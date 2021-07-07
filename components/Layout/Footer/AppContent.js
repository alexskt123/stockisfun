import Link from 'next/link'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import { GiBirdTwitter } from 'react-icons/gi'
import { RiProfileLine, RiPagesLine } from 'react-icons/ri'
import styled from 'styled-components'

const WhiteLink = styled.a`
  color: white;
`
const defaultNavElements = [
  {
    label: 'Profile',
    href: '/profile',
    icon: <RiProfileLine />
  },
  {
    label: 'Main',
    href: '/highlight',
    icon: <RiPagesLine />
  },
  {
    label: 'Bird',
    href: '/compare/birdmouth',
    icon: <GiBirdTwitter />
  }
]

const AppContent = () => {
  return (
    <Nav className="mr-auto w-100">
      {defaultNavElements.map((item, idx) => {
        return (
          <Col key={idx}>
            <Badge
              style={{ display: 'flex', alignItems: 'center' }}
              className="ml-1 justify-content-center"
              variant="dark"
            >
              {item.icon}
              <Link href={item.href} passHref>
                <WhiteLink>{item.label}</WhiteLink>
              </Link>
            </Badge>
          </Col>
        )
      })}
    </Nav>
  )
}

export default AppContent

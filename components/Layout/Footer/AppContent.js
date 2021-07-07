import Link from 'next/link'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import { GiBirdTwitter } from 'react-icons/gi'
import { RiProfileLine, RiPagesLine } from 'react-icons/ri'

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
  const router = useRouter()

  return (
    <Nav className="mr-auto w-100">
      {defaultNavElements.map((item, idx) => {
        const active = router.pathname === item.href
        return (
          <Col key={idx}>
            <Badge
              style={{ display: 'flex', alignItems: 'center' }}
              className="ml-1 justify-content-center"
              variant="dark"
            >
              {item.icon}
              <Link href={item.href} passHref>
                <Nav.Link active={active} disabled={active}>
                  {`${item.label}`}
                </Nav.Link>
              </Link>
            </Badge>
          </Col>
        )
      })}
    </Nav>
  )
}

export default AppContent

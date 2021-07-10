import Link from 'next/link'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { BiTrendingUp } from 'react-icons/bi'
import { GoCalendar } from 'react-icons/go'
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
    label: 'Trend',
    href: '/trend',
    icon: <BiTrendingUp />
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: <GoCalendar />
  }
]

const AppContent = () => {
  const router = useRouter()

  return (
    <Container className="overflow-auto">
      {defaultNavElements.map((item, idx) => {
        const active = router.pathname === item.href
        return (
          <Col xs={'auto'} key={idx}>
            <Link href={item.href} passHref>
              <Nav.Link active={active} disabled={active}>
                <Badge
                  style={{
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  variant="dark"
                >
                  {item.icon}
                  {`${item.label}`}
                </Badge>
              </Nav.Link>
            </Link>
          </Col>
        )
      })}
    </Container>
  )
}

export default AppContent

import { defaultFooterNavElements } from '@/config/settings'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'

const AppContent = () => {
  const router = useRouter()

  return (
    <Container className="overflow-auto my-2">
      {defaultFooterNavElements.map((item, idx) => {
        const active = router.pathname === item.href
        return (
          <Col style={{ padding: '0rem' }} xs={'auto'} key={idx}>
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

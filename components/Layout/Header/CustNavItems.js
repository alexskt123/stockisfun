import { Fragment } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from 'react-bootstrap/Nav'

const CustNavItems = ({ NavItems }) => {
  const router = useRouter()

  return (
    <Fragment>
      {NavItems
        ? NavItems.map((item, idx) => {
            const href = `${item.href}`
            const active = router.pathname === href

            return (
              <Link key={`${idx}`} href={href} passHref>
                <Nav.Link active={active} disabled={active}>
                  {`${item.label}`}
                </Nav.Link>
              </Link>
            )
          })
        : null}
    </Fragment>
  )
}

export default CustNavItems

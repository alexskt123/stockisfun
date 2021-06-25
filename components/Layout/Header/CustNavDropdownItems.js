import { Fragment } from 'react'
import { useRouter } from 'next/router'

import Link from 'next/link'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Badge from 'react-bootstrap/Badge'

const CustNavDropdownItems = ({ NavDropDown }) => {
  const router = useRouter()

  return (
    <Fragment>
      <NavDropdown title="Comparison" id="nav-dropdown">
        {NavDropDown
          ? NavDropDown.map(item => item.category)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((cat, catIdx) => {
                return (
                  <Fragment key={`${cat}${catIdx}`}>
                    <Badge variant="dark" className="ml-1">
                      {cat}
                    </Badge>
                    <NavDropdown.Divider />
                    {NavDropDown.filter(x => x.category === cat).map(
                      (item, idx) => {
                        const href = `${item.href}`
                        const active = router.asPath === href
                        return (
                          <Link key={`${cat}${idx}`} href={href} passHref>
                            <NavDropdown.Item active={active} disabled={active}>
                              {`${item.label}`}
                            </NavDropdown.Item>
                          </Link>
                        )
                      }
                    )}
                  </Fragment>
                )
              })
          : null}
      </NavDropdown>
    </Fragment>
  )
}

export default CustNavDropdownItems

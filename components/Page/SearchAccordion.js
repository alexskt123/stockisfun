
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

export default function SearchAccordion({ children, inputTicker }) {

  const [accordionActive, setAccordionActive] = useState('-1')

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      setAccordionActive('-1')
    } else {
      setAccordionActive('0')
    }
  }, [query])

  return (
    <Fragment>
      <Accordion activeKey={accordionActive} onSelect={() => setAccordionActive(accordionActive == '-1' ? '0' : '-1')}>
        <Card style={{ backgroundColor: '#f0f0f0' }}>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <b>
              <Badge variant="dark">{inputTicker == '' ? 'Click here to Search!' : inputTicker.toUpperCase()}</Badge>
            </b>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              {children}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Fragment >
  )
}

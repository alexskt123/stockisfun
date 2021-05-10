
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

import useDarkMode from 'use-dark-mode'

export default function SearchAccordion({ children, inputTicker }) {

  const [accordionActive, setAccordionActive] = useState('-1')

  const router = useRouter()
  const { query } = router.query

  const darkMode = useDarkMode(false)

  useEffect(() => {
    setAccordionActive(query ? '-1' : '0')
  }, [query])

  return (
    <Fragment>
      <Accordion activeKey={accordionActive} onSelect={() => setAccordionActive(accordionActive == '-1' ? '0' : '-1')}>
        <Card style={{ backgroundColor: darkMode.value ? '#7ca67e' : '#ebffe3' }}>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <b>
              <Badge variant="dark">{inputTicker == '' || !inputTicker ? 'Click here to Search!' : inputTicker}</Badge>
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

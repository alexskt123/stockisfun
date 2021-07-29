import { Fragment, useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'

export default function SearchAccordion({ children, inputTicker }) {
  const [expanded, setExpanded] = useState(false)

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    setExpanded(!query)
  }, [query])

  const onChange = () => {
    setExpanded(!expanded)
  }

  return (
    <Fragment>
      <Accordion onChange={() => onChange()} allowZeroExpanded={true}>
        <AccordionItem uuid={'StockDetail'} dangerouslySetExpanded={expanded}>
          <AccordionItemHeading>
            <AccordionItemButton>
              <Badge variant="dark">
                {inputTicker || 'Click here to Search!'}
              </Badge>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Card.Body>{children}</Card.Body>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </Fragment>
  )
}

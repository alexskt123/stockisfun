import { Fragment } from 'react'

import { MathComponent } from 'mathjax-react'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'

export default function FormulaCard({ content }) {
  return (
    <Fragment>
      <Card variant={'success'} text={'dark'} style={{ ['minWidth']: '10rem' }}>
        <Card.Header style={{ padding: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <b>
              <span>{content.label}</span>
            </b>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: '0.2rem' }}>
          <div className="ms-3">{<MathComponent tex={content.formula} />}</div>
          {content.remarks.map((item, idx) => {
            return (
              <div className="ms-3 mt-1" key={idx}>
                <Badge bg="light" text="dark">
                  {item}
                </Badge>
              </div>
            )
          })}
        </Card.Body>
      </Card>
    </Fragment>
  )
}

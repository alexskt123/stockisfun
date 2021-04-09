
import { Fragment } from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { MathComponent } from 'mathjax-react'


export default function FormulaCard({ content }) {
  return (
    <Fragment>
      <Card
        variant={'success'}
        text={'dark'}
        style={{ ['minWidth']: '10rem' }}
      >
        <Card.Header style={{ padding: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <b>
              <span>
                {content.label}
              </span>
            </b>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: '0.2rem' }}>
          <Row className="ml-3">
            {<MathComponent tex={content.formula} />}
          </Row>
          {
            content.remarks.map((item, idx) => {
              return <Row className="ml-3 mt-1" key={idx}><Badge variant="light">{item}</Badge></Row>
            })
          }
        </Card.Body>
      </Card>

    </Fragment>
  )
}
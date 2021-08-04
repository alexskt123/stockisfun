import { useBgColor } from '@/lib/hooks/useBgColor'
import { Col, Container, Row } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'

export default function SearchItem({ list }) {
  const variant = useBgColor('light', 'dark')

  return (
    <div className="my-3">
      <ListGroup>
        {list?.length < 1 ? (
          <ListGroupItem variant={variant}>
            <h4>Cannot find any records.</h4>
          </ListGroupItem>
        ) : (
          list?.map(item => (
            <ListGroupItem variant={variant} key={item.symbol}>
              <Container>
                <Row>
                  <h4>
                    <a
                      target="_blank"
                      href={`/highlight?query=${item.symbol}&type=quote`}
                      rel="noreferrer"
                    >
                      {item.symbol}
                    </a>
                  </h4>
                </Row>

                <Row>
                  <Col className="mr-auto">{item.name}</Col>
                  <Badge>{`${item.exchDisp} - ${item.typeDisp}`}</Badge>
                </Row>
              </Container>
            </ListGroupItem>
          ))
        )}
      </ListGroup>
    </div>
  )
}

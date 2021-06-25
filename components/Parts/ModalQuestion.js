import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function ModalQuestion({
  showCondition,
  onHide,
  onClickYes,
  onClickNo,
  title,
  body
}) {
  return (
    <Modal centered size="sm" show={showCondition} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onClickYes}>
          {'Yes'}
        </Button>
        <Button variant="danger" onClick={onClickNo}>
          {'No'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

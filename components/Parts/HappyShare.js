import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { BiShareAlt } from 'react-icons/bi'
import { IconContext } from 'react-icons'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import { EmailShareButton, EmailIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon } from 'react-share'

import { getShareUrl } from '../../lib/commonFunction'

export default function HappyShare({ inputStyle }) {
  const router = useRouter()

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)

  const handleClick = () => {
    setShow(true)
  }

  const defaultStyle = { color: 'black', size: '13px' }

  const defaultParams = {
    url: `${getShareUrl()}${router.asPath}`,
    props: {
      size: 40,
      round: true
    }
  }

  const newStyle = {
    ...defaultStyle,
    ...inputStyle
  }

  const shareMethods = [{
    ...defaultParams,
    component: withShareButton(WhatsappShareButton, WhatsappIcon)
  }, {
    ...defaultParams,
    component: withShareButton(TelegramShareButton, TelegramIcon)
  }, {
    ...defaultParams,
    component: withShareButton(EmailShareButton, EmailIcon)
  }]

  return (
    <Fragment>
      <IconContext.Provider
        value={{ ...newStyle }}
      >
        <BiShareAlt onClick={() => handleClick()} className="ml-1" />
      </IconContext.Provider>
      <Modal centered size="sm" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><Badge variant="light">{'Share to your friends!'}</Badge></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            shareMethods.map((share, idx) => {
              return (
                <Fragment key={idx}>
                  <share.component url={share.url} {...share.props}></share.component>
                </Fragment>
              )
            })
          }
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}


function withShareButton(ButtonComponent, IconComponent) {
  return function ShareButtonComponent({ url, ...props }) {
    return (
      <ButtonComponent
        className="ml-1"
        url={url}
      >
        <IconComponent {...props} />
      </ButtonComponent>
    )
  }
}

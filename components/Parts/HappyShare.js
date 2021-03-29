import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { BiShareAlt } from 'react-icons/bi'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import { EmailShareButton, EmailIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon } from "react-share"

import { getShareUrl } from '../../lib/commonFunction'

export default function HappyShare() {
    const router = useRouter()

    const [show, setShow] = useState(false)
  
    const handleClose = () => setShow(false)

    const handleClick = () => {
        setShow(true)
    }

    return (
        <Fragment>
            <BiShareAlt onClick={() => handleClick()} className="ml-1" />
            <Modal centered size="sm" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><Badge variant="light">Share to your friends!</Badge></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <WhatsappShareButton
                        url={`${getShareUrl()}${router.asPath}`}
                    >
                        <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                    <TelegramShareButton
                        className="ml-1"
                        url={`${getShareUrl()}${router.asPath}`}
                    >
                        <TelegramIcon size={40} round />
                    </TelegramShareButton>
                    <EmailShareButton
                        className="ml-1"
                        url={`${getShareUrl()}${router.asPath}`}
                    >
                        <EmailIcon size={40} round />
                    </EmailShareButton>
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}
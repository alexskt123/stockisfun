import { Fragment, useEffect, useState } from 'react'

import validator from 'email-validator'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import LoadingOverlay from 'react-loading-overlay'

import CooldownBadge from './CooldownBadge'
import HeaderBadge from './HeaderBadge'
import { CooldownButton } from '@/components/CooldownButton'
import { fireToast } from '@/lib/commonFunction'
import { updateUserData } from '@/lib/firebaseResult'
import { toAxios } from '@/lib/request'

export default function EmailSubscriptionCard({
  user,
  userData,
  item,
  minWidth
}) {
  const [inputData, setInputData] = useState(item)
  const [emailSending, setEmailSending] = useState(false)

  useEffect(() => {
    const userEmailData = userData?.emailConfig?.find(x => x.id === item.id)
    setInputData(userEmailData || { ...item, to: user?.email })
  }, [item, user, userData])

  const handleDataChange = (e, itemKey) => {
    const newData = {
      ...inputData,
      [itemKey]: e.target.value
    }
    setInputData(newData)
  }

  const validEmail = () => {
    const validEmail = validator.validate(inputData.to)

    !validEmail &&
      fireToast({
        icon: 'error',
        title: 'Invalid Email'
      })

    return validEmail
  }

  const onSubscribe = async () => {
    if (!validEmail()) return

    const newInputData = { ...inputData, subscribe: !inputData.subscribe }
    setInputData(newInputData)

    const newEmailList = [
      ...(userData?.emailConfig || []).filter(x => x.id !== newInputData.id),
      newInputData
    ]

    await updateUserData(userData.docId, {
      emailConfig: newEmailList
    })

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const onTest = async () => {
    if (!validEmail()) return

    const newEmailList = [
      ...(userData?.emailConfig || []).filter(x => x.id !== inputData.id),
      inputData
    ]

    setEmailSending(true)

    await updateUserData(userData.docId, {
      emailConfig: newEmailList
    })
    const response = await toAxios('/api/sendUserEmail', {
      type: 'id',
      id: inputData.id,
      uid: userData.userID
    })

    setEmailSending(false)

    const toast = (response?.data?.error && {
      icon: 'error',
      title: 'Some Error!'
    }) || {
      icon: 'success',
      title: 'Sent!'
    }

    fireToast(toast)
  }

  const inputSettings = [
    {
      label: 'To Email',
      value: inputData?.to,
      key: 'to'
    },
    {
      label: 'Subject',
      value: inputData?.subject,
      key: 'subject'
    }
  ]

  return (
    <Fragment>
      <Card
        text={'dark'}
        border={'light'}
        style={{
          ['minWidth']: minWidth || '20rem',
          backgroundColor: '#f5f7f2'
        }}
      >
        {inputData?.name && (
          <Card.Header style={{ padding: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <HeaderBadge
                headerTag={'h5'}
                title={inputData.name}
                badgeProps={{ bg: 'secondary' }}
              />
            </div>
          </Card.Header>
        )}
        <Card.Body style={{ padding: '0.2rem' }}>
          <LoadingOverlay active={emailSending} spinner text="Sending Email...">
            <Form.Group>
              {inputSettings.map((curInput, idx) => {
                return (
                  <Fragment key={idx}>
                    <Form.Label>
                      <Badge bg="dark">{curInput.label}</Badge>
                    </Form.Label>
                    <Form.Control
                      className="w-100"
                      size="sm"
                      value={curInput.value}
                      onChange={e => handleDataChange(e, curInput.key)}
                    />
                  </Fragment>
                )
              })}
            </Form.Group>
            <Badge
              className="cursor"
              bg={(inputData?.subscribe && 'danger') || 'success'}
              onClick={() => onSubscribe()}
            >
              {(inputData?.subscribe && 'UnSubscribe') || 'Subscribe'}
            </Badge>
            <CooldownButton
              stateKey={'testEmail'}
              cooldownTime={10 * 1000}
              handleClick={onTest}
              renderOnCDed={RefreshBadge}
              renderOnCDing={CooldownBadge}
            />
          </LoadingOverlay>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

const RefreshBadge = ({ handleClick }) => {
  return (
    <Badge className="cursor mx-2" bg={'warning'} onClick={() => handleClick()}>
      {'Test'}
    </Badge>
  )
}

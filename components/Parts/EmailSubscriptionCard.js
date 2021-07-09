import { Fragment } from 'react'

import { fireToast } from '@/lib/commonFunction'
import { updUserEmailConfig } from '@/lib/firebaseResult'
import { useUserEmailSubscription } from '@/lib/hooks/email'
import validator from 'email-validator'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

export default function EmailSubscriptionCard({
  user,
  userData,
  item,
  minWidth
}) {
  const inputData = useUserEmailSubscription(user, userData, item)

  const handleDataChange = (e, itemKey) => {
    const newData = {
      ...inputData,
      [itemKey]: e.target.value
    }
    setInputData(newData)
  }

  const onSubscribe = async () => {
    const validEmail = validator.validate(inputData.to)

    if (!validEmail) {
      fireToast({
        icon: 'error',
        title: 'Invalid Email'
      })
      return
    }

    const newInputData = { ...inputData, subscribe: !inputData.subscribe }
    setInputData(newInputData)

    const newEmailList = [
      ...(userData?.emailConfig || []).filter(x => x.id !== newInputData.id),
      newInputData
    ]

    await updUserEmailConfig(user.uid, newEmailList)

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
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
          ['minWidth']: minWidth ? minWidth : '10rem',
          backgroundColor: '#f5f7f2'
        }}
      >
        {inputData?.name && (
          <Card.Header style={{ padding: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <h5>
                <Badge variant="secondary">
                  <b>{inputData.name}</b>
                </Badge>
              </h5>
            </div>
          </Card.Header>
        )}
        <Card.Body style={{ padding: '0.2rem' }}>
          <Form.Group>
            {inputSettings.map((curInput, idx) => {
              return (
                <Fragment key={idx}>
                  <Form.Label>
                    <Badge variant="dark">{curInput.label}</Badge>
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
            variant={inputData?.subscribe ? 'danger' : 'success'}
            onClick={() => onSubscribe()}
          >
            {inputData?.subscribe ? 'UnSubscribe' : 'Subscribe'}
          </Badge>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

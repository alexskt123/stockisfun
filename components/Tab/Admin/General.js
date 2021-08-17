import { Fragment } from 'react'

import HeaderBadge from '@/components/Parts/HeaderBadge'
import { userStockList } from '@/config/admin'
import { fireToast } from '@/lib/commonFunction'
import { updateUserData } from '@/lib/firebaseResult'
import { debounce } from 'debounce'
import Form from 'react-bootstrap/Form'

export const General = ({ userData }) => {
  const filterInput = input => {
    return `${input}`
      .replace(/[^a-zA-Z,]/g, '')
      .toUpperCase()
      .split(',')
      .sort()
      .filter(x => x.trim().length > 0)
      .filter((value, idx, self) => self.indexOf(value) === idx)
  }

  const handleChange = debounce(async (e, type) => {
    const checking =
      type === 'cash' ? input => parseFloat(input) || 0 : filterInput

    const data = {
      [type]: checking(e.target.value)
    }

    await updateUserData(userData.docId, data)

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }, 1000)

  return (
    <Fragment key={Math.random()}>
      <div className="d-flex flex-column my-3">
        {userStockList.map(item => (
          <Form.Group key={item.key} controlId={item.key}>
            <Form.Label>
              <HeaderBadge
                headerTag={'h5'}
                title={item.badge.title}
                badgeProps={{ variant: 'dark' }}
              />
            </Form.Label>
            <Form.Control
              defaultValue={userData[item.name]}
              onChange={e => handleChange(e, item.name)}
              {...(item?.control || {})}
            />
          </Form.Group>
        ))}
      </div>
    </Fragment>
  )
}

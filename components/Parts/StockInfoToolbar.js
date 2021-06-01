import Button from 'react-bootstrap/Button'
import CustomIcons from '../../lib/components/CustomIcons'

function StockInfoToolbar({ tools, inputTicker }) {

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        tools.map((item, idx) => {
          const href = item.type === 'etftostock' ? `/${item.redirectURL}?ticker=${inputTicker}&href=${item.href}`
            : '/'
          return <Button target="_blank" href={href} style={{ padding: '0.1rem 0.1rem' }} className="ml-1" size="sm" variant={'dark'} key={idx}>
            {CustomIcons(item)}
          </Button>
        })
      }
    </div>
  )
}

export default StockInfoToolbar

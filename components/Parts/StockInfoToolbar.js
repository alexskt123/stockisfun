import CustomIcons from '../../lib/components/CustomIcons'
import { IconContext } from 'react-icons'

function StockInfoToolbar({ tools, inputTicker }) {

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        tools.map((item, idx) => {
          const href = item.type === 'etftostock' ? `/${item.redirectURL}?ticker=${inputTicker}&href=${item.href}`
            : '/'
          return <a target="_blank" href={href} className="ml-1" key={idx}>
            <IconContext.Provider
              value={{ color: 'black' }}
            >
              {CustomIcons(item)}
            </IconContext.Provider>
          </a>
        })
      }
    </div>
  )
}

export default StockInfoToolbar

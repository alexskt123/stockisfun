import CustomIcons from '@/lib/components/CustomIcons'

function StockInfoToolbar({ tools, inputTicker }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {tools.map((item, idx) => {
        const href =
          item.type === 'etftostock'
            ? `/${item.redirectURL}?ticker=${inputTicker}&href=${item.href}`
            : '/'
        return (
          <a
            style={{ color: 'black' }}
            target="_blank"
            href={href}
            className="ml-1"
            key={idx}
            rel="noreferrer"
          >
            {CustomIcons(item)}
          </a>
        )
      })}
    </div>
  )
}

export default StockInfoToolbar

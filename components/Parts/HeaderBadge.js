import Badge from 'react-bootstrap/Badge'

const HeaderBadge = ({ headerTag, title, badgeProps }) => {
  const HeaderTag = headerTag

  return (
    <HeaderTag>
      <Badge {...badgeProps}>{title}</Badge>
    </HeaderTag>
  )
}

export default HeaderBadge

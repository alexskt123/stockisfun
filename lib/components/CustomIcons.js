import { AiFillEye } from 'react-icons/ai'
import { BiTrendingUp } from 'react-icons/bi'
import { GiBirdTwitter } from 'react-icons/gi'
import { RiExchangeDollarFill } from 'react-icons/ri'

const CustomIcons = ({ icon, label }) => {
  const reactIcon =
    icon === 'AiFillEye' ? (
      <AiFillEye />
    ) : icon === 'RiExchangeDollarFill' ? (
      <RiExchangeDollarFill />
    ) : icon === 'BiTrendingUp' ? (
      <BiTrendingUp />
    ) : icon === 'GiBirdTwitter' ? (
      <GiBirdTwitter />
    ) : (
      <span>{label}</span>
    )

  return reactIcon
}

export default CustomIcons

import {AiFillEye} from 'react-icons/ai'
import {RiExchangeDollarFill} from 'react-icons/ri'
import {BiTrendingUp} from 'react-icons/bi'

const CustomIcons = ({icon, label}) => {
  const reactIcon = icon === 'AiFillEye' ? <AiFillEye/>
    : icon === 'RiExchangeDollarFill' ? <RiExchangeDollarFill/>
      : icon === 'BiTrendingUp' ? <BiTrendingUp/>
        : <span>{label}</span>

  return reactIcon
}


export default CustomIcons
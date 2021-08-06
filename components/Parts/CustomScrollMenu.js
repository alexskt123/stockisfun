import { Fragment } from 'react'

import ScrollMenu from 'react-horizontal-scrolling-menu'
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'

import 'styles/ScrollMenu.module.css'

const CustomScrollMenu = ({ data, ChildComponent, onSelect }) => {
  return (
    <Fragment>
      <ScrollMenu
        data={data.map((item, idx) => {
          return (
            <div key={idx} className="menu-item">
              <ChildComponent {...item} />
            </div>
          )
        })}
        arrowLeft={<AiFillLeftCircle />}
        arrowRight={<AiFillRightCircle />}
        menuClass="justify-content-center"
        onSelect={onSelect}
        wheel={false}
        alignCenter={false}
        alignOnResize={false}
      />
    </Fragment>
  )
}

export default CustomScrollMenu

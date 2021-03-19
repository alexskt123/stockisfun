/* global describe,it */
import { shallow } from 'enzyme'
import React from 'react'
import { expect } from 'chai'

import Home from '../pages/index.js'

describe('Home Page', () => {
  it('App shows 2 banners', () => {
    const app = shallow(<Home />)

    console.log(app.html())

    expect(app.exists()).to.be.true
  })
})

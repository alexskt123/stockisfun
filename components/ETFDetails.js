
import { Fragment, useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import Holdings from '../components/Tab/ETFDetail/Holdings'
import Stat from '../components/Tab/ETFDetail/Stat'
import Basics from '../components/Tab/ETFDetail/Basics'

import { etfDetailsSettings } from '../config/etf'
import { useRouter } from 'next/router'
import { useTab } from '../lib/hooks/useTab'

function ETFDetails({ inputTicker }) {
  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, { shallow: true })
  }

  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  const handleTicker = (inputTicker) => {
    const newSettings = {
      ...etfDetailsSettings,
      inputETFTicker: inputTicker.toUpperCase()
    }

    setSettings(newSettings)
  }

  useEffect(() => {
    inputTicker && inputTicker != '' ? handleTicker(inputTicker) : clearItems()
  }, [inputTicker])

  const clearItems = () => {
    setSettings({ ...etfDetailsSettings })
  }

  const cellClick = (item) => {
    router.push(`/stockdetail?query=${item.find(x => x)}`)
  }

  const tabs = [{
    tab: {
      eventKey: 'Basics',
      title: 'Basics'
    },
    child: {
      component: Basics,
      props: {
        inputETFTicker: settings.inputETFTicker
      }
    }
  }, {
    tab: {
      eventKey: 'Holdings',
      title: 'Holdings'
    },
    child: {
      component: Holdings,
      props: {
        inputETFTicker: settings.inputETFTicker,
        cellClick
      }
    }
  }, {
    tab: {
      eventKey: 'Statistics',
      title: 'Stat.'
    },
    child: {
      component: Stat,
      props: {
        inputETFTicker: settings.inputETFTicker
      }
    }
  }]

  return (
    <Fragment>
      <Tabs
        style={{ fontSize: '11px' }}
        className="mt-1"
        activeKey={tab}
        onSelect={(k) => changeTab(k)}
      >
        {
          tabs.map((tab, idx) => {
            return (
              <Tab key={idx} {...tab.tab} >
                <tab.child.component {...tab.child.props} />
              </Tab>
            )
          })
        }
      </Tabs>
    </Fragment>
  )
}

export default ETFDetails

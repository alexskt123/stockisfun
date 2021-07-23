import { Fragment, useState, useEffect } from 'react'

import { etfDetailsSettings, buildTabs } from '@/config/etf'
import { useTab } from '@/lib/hooks/useTab'
import { useRouter } from 'next/router'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

function ETFDetails({ inputTicker }) {
  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, {
      shallow: true
    })
  }

  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  const handleTicker = inputTicker => {
    const newSettings = {
      ...etfDetailsSettings,
      inputETFTicker: inputTicker.toUpperCase()
    }

    setSettings(newSettings)
  }

  useEffect(() => {
    inputTicker ? handleTicker(inputTicker) : clearItems()
  }, [inputTicker])

  const clearItems = () => {
    setSettings({ ...etfDetailsSettings })
  }

  const tabs = buildTabs(settings.inputETFTicker)

  return (
    <Fragment>
      <Tabs
        style={{ fontSize: '11px' }}
        className="mt-1"
        activeKey={tab}
        onSelect={k => changeTab(k)}
      >
        {tabs.map((tab, idx) => {
          return (
            <Tab key={idx} {...tab.tab}>
              <tab.child.component {...tab.child.props} />
            </Tab>
          )
        })}
      </Tabs>
    </Fragment>
  )
}

export default ETFDetails

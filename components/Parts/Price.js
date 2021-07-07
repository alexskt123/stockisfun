import { Fragment, useState, useEffect } from 'react'

import LoadingSpinner from '@/components/Loading/LoadingSpinner'
import {
  priceSchema,
  priceChartSettings,
  priceChartOptions,
  ma5ChartSettings,
  ma20ChartSettings,
  ma60ChartSettings,
  dateRangeSelectAttr,
  maSelectAttr
} from '@/config/price'
import { staticSWROptions, fetcher } from '@/config/settings'
import { ma, ema } from 'moving-averages'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { Line } from 'react-chartjs-2'
import useSWR from 'swr'

import TradingViewModal from './TradingViewModal'
import YahooQuoteInfo from './YahooQuoteInfo'

function PriceInfo({ inputTicker, inputMA, options, displayQuoteFields }) {
  const [settings, setSettings] = useState({ ...priceSchema, ma: inputMA })

  const dateprice = useSWR(
    `/api/yahoo/getYahooHistoryPrice?ticker=${inputTicker}&days=${
      parseInt(settings.days) + 60
    }&isBus=true`,
    fetcher,
    staticSWROptions
  )

  useEffect(() => {
    handleTicker(dateprice, settings.days, settings.ma)
    return () => setSettings(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateprice, settings.days, settings.ma])

  const getPrice = (dateprice, inputDays, inputMA) => {
    //temp solution to fix the warnings - [react-chartjs-2] Warning: Each dataset needs a unique key.
    if (!inputTicker) return

    const date = dateprice.data?.date || []
    const price = dateprice.data?.price || []
    const ma5 =
      inputMA === 'ma'
        ? ma([...price], 5)
        : inputMA === 'ema'
        ? ema([...price], 5)
        : []
    const ma20 =
      inputMA === 'ma'
        ? ma([...price], 20)
        : inputMA === 'ema'
        ? ema([...price], 20)
        : []
    const ma60 =
      inputMA === 'ma'
        ? ma([...price], 60)
        : inputMA === 'ema'
        ? ema([...price], 60)
        : []

    setSettings({
      ticker: inputTicker,
      days: inputDays,
      ma: inputMA,
      chartData: {
        labels: [...date.slice(60)],
        datasets: [
          {
            ...priceChartSettings,
            label: inputTicker,
            data: [...price.slice(60)],
            showLine: inputMA === '' ? true : false,
            pointRadius: inputMA === '' ? 0 : 3
          },
          {
            ...ma5ChartSettings,
            data: [...ma5.slice(60)]
          },
          {
            ...ma20ChartSettings,
            data: [...ma20.slice(60)]
          },
          {
            ...ma60ChartSettings,
            data: [...ma60.slice(60)]
          }
        ]
      }
    })
  }

  const handleChange = e => {
    e.target.name === 'formYear' &&
    parseInt(e.target.value) !== parseInt(settings.days)
      ? handleTicker(inputTicker, e.target.value, settings.ma)
      : e.target.name === 'formma' && e.target.value !== settings.ma
      ? handleTicker(inputTicker, settings.days, e.target.value)
      : handleTicker(null, null, null)
  }

  function handleTicker(dateprice, inputDays, inputMA) {
    clearItems()
    getPrice(dateprice, inputDays, inputMA)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      ticker: '',
      tableData: [],
      tableHeader: [],
      chartData: {}
    })
  }

  return (
    <Fragment>
      {!dateprice.data && <LoadingSpinner />}
      {displayQuoteFields && (
        <YahooQuoteInfo
          data={dateprice?.data?.quote}
          displayQuoteFields={displayQuoteFields}
        />
      )}
      <div
        style={{ display: 'inline-flex', alignItems: 'baseline' }}
        className="ml-1"
      >
        <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
          <h6>
            <Badge variant="dark">
              <span>{'In Business Days'}</span>
            </Badge>
          </h6>
        </Form.Label>
        <Form.Control
          {...dateRangeSelectAttr.formControl}
          value={settings.days}
          custom
          onChange={e => handleChange(e)}
        >
          {dateRangeSelectAttr.dateRangeOptions.map((item, index) => {
            return (
              <option key={`${item}${index}`} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </Form.Control>
        <Form.Control
          {...maSelectAttr.formControl}
          value={settings.ma}
          custom
          onChange={e => handleChange(e)}
        >
          {maSelectAttr.maOptions.map((item, index) => {
            return (
              <option key={`${item}${index}`} value={item.value}>
                {item.label}
              </option>
            )
          })}
        </Form.Control>
      </div>
      <div
        style={{ display: 'inline-flex', alignItems: 'baseline' }}
        className="ml-1"
      >
        <TradingViewModal buttonClassName={'cursor'} ticker={inputTicker} />
      </div>
      <Line
        data={settings.chartData}
        options={
          options ? { ...priceChartOptions, ...options } : priceChartOptions
        }
      />
    </Fragment>
  )
}

export default PriceInfo

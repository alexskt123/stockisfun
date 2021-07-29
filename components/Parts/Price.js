import { Fragment, useState, useEffect } from 'react'

import FormOptions from '@/components/Form/FormOptions'
import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import {
  priceSchema,
  priceChartSettings,
  priceChartOptions,
  dateRangeSelectAttr,
  maSelectAttr,
  maChartSettings,
  maChartSchema
} from '@/config/price'
import {
  loadingSkeletonColors,
  loadingSkeletonPriceParts
} from '@/config/settings'
import { useStaticSWR } from '@/lib/request'
import { ma, ema } from 'moving-averages'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { Line } from 'react-chartjs-2'

import TradingViewModal from './TradingViewModal'
import YahooQuoteInfo from './YahooQuoteInfo'

function PriceInfo({ inputTicker, inputMA, options, displayQuoteFields }) {
  const [settings, setSettings] = useState({ ...priceSchema, ma: inputMA })

  const datePrice = useStaticSWR(
    inputTicker,
    `/api/yahoo/getHistoryPrice?ticker=${inputTicker}&days=${
      parseInt(settings.days) + 60
    }&isBus=true`
  )

  const getMA = (inputMA, days, MACalculation, price) => {
    return inputMA !== '' ? MACalculation([...price], days) : []
  }

  useEffect(() => {
    handleTicker(datePrice, settings.days, settings.ma)
    return () => setSettings(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePrice, settings.days, settings.ma])

  const getPrice = (datePrice, inputDays, inputMA) => {
    //temp solution to fix the warnings - [react-chartjs-2] Warning: Each dataset needs a unique key.
    if (!inputTicker) return

    const historyPrice = datePrice.data?.historyPrice || []
    const calMA = inputMA === 'ema' ? ema : ma
    const maCharts = maChartSettings.map(ma => {
      const data = getMA(
        inputMA,
        ma.value,
        calMA,
        historyPrice.map(item => item.price)
      ).slice(60)
      return {
        ...maChartSchema,
        ...ma,
        data
      }
    })

    setSettings({
      ticker: inputTicker,
      days: inputDays,
      ma: inputMA,
      chartData: {
        labels: [...historyPrice.slice(60).map(item => item.date)],
        datasets: [
          {
            ...priceChartSettings,
            label: inputTicker,
            data: [...historyPrice.slice(60).map(item => item.price)],
            showLine: inputMA === '',
            pointRadius: inputMA === '' ? 0 : 3
          },
          ...maCharts
        ]
      }
    })
  }

  const handleChange = e => {
    e.target.name === 'formYear' &&
    parseInt(e.target.value) !== parseInt(settings.days)
      ? handleTicker(inputTicker, e.target.value, settings.ma)
      : e.target.name === 'formMA' && e.target.value !== settings.ma
      ? handleTicker(inputTicker, settings.days, e.target.value)
      : handleTicker(null, null, null)
  }

  function handleTicker(datePrice, inputDays, inputMA) {
    clearItems()
    getPrice(datePrice, inputDays, inputMA)
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
      {!datePrice.data ? (
        <LoadingSkeletonTable
          customColors={loadingSkeletonColors.light}
          customSettings={loadingSkeletonPriceParts}
        />
      ) : (
        <Fragment>
          {displayQuoteFields && (
            <YahooQuoteInfo
              data={datePrice?.data?.quote}
              displayQuoteFields={displayQuoteFields}
            />
          )}
          <div
            style={{ display: 'inline-flex', alignItems: 'baseline' }}
            className="ml-1"
          >
            <Form.Label
              className="my-1 mr-2"
              htmlFor="inlineFormCustomSelectPref"
            >
              <h6>
                <Badge variant="dark">
                  <span>{'In Business Days'}</span>
                </Badge>
              </h6>
            </Form.Label>
            <FormOptions
              formOptionSettings={dateRangeSelectAttr}
              value={settings.days}
              handleChange={handleChange}
            />
            <FormOptions
              formOptionSettings={maSelectAttr}
              value={settings.ma}
              handleChange={handleChange}
            />
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
      )}
    </Fragment>
  )
}

export default PriceInfo

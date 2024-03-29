import { Fragment, useState, useEffect } from 'react'

import { ma, ema } from 'moving-averages'
import Badge from 'react-bootstrap/Badge'
import { Line } from 'react-chartjs-2'

import RelativeStrength from './RelativeStrength'
import TradingViewModal from './TradingViewModal'
import YahooQuoteInfo from './YahooQuoteInfo'
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

const getMA = (inputMA, days, MACalculation, price) => {
  return (inputMA !== '' && MACalculation([...price], days)) || []
}

function PriceInfo({
  inputTicker,
  inputMA,
  inputDays,
  options,
  displayQuoteFields,
  inputShowRS,
  rsTicker
}) {
  const [settings, setSettings] = useState({
    ...priceSchema,
    ma: inputMA,
    days: inputDays || priceSchema.days
  })
  const [showRS, setShowRS] = useState(inputShowRS)

  const datePrice = useStaticSWR(
    inputTicker,
    `/api/yahoo/getHistoryPrice?ticker=${inputTicker}&days=${
      parseInt(settings.days) + 150
    }&isBus=true`
  )

  useEffect(() => {
    handleTicker({ inputDays: settings.days, inputMA: settings.ma })
    return () => setSettings({ ...priceSchema, ma: inputMA })
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePrice, settings.days, settings.ma])

  const getPrice = options => {
    const { inputDays, inputMA } = options

    const historyPrice = datePrice.data?.historyPrice || []
    const calMA = (inputMA === 'ema' && ema) || ma
    const maCharts = maChartSettings.map(ma => {
      const data = getMA(
        inputMA,
        ma.value,
        calMA,
        historyPrice.map(item => item.price)
      ).slice(150)

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
        labels: [...historyPrice.slice(150).map(item => item.date)],
        datasets: [
          {
            ...priceChartSettings,
            label: inputTicker,
            data: [...historyPrice.slice(150).map(item => item.price)],
            showLine: inputMA === '',
            pointRadius: (inputMA === '' && 0) || 3
          },
          ...maCharts
        ]
      }
    })
  }

  const handleChange = e => {
    const inputDays =
      (e.target.name === 'formYear' &&
        parseInt(e.target.value) !== parseInt(settings.days) &&
        e.target.value) ||
      settings.days
    const inputMA =
      (e.target.name === 'formMA' &&
        e.target.value !== settings.ma &&
        e.target.value) ||
      settings.ma
    const options = {
      inputDays,
      inputMA
    }
    handleTicker(options)
  }

  function handleTicker(options) {
    inputTicker && getPrice(options)
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
            className="ms-1"
          >
            <FormOptions
              formOptionSettings={dateRangeSelectAttr}
              value={settings.days}
              handleChange={handleChange}
              label={'In Business Days'}
            />
            <FormOptions
              formOptionSettings={maSelectAttr}
              value={settings.ma}
              handleChange={handleChange}
            />
          </div>
          <div
            style={{ display: 'inline-flex', alignItems: 'baseline' }}
            className="ms-1"
          >
            <Badge
              bg={showRS ? 'danger' : 'success'}
              className={'cursor mr-2'}
              onClick={() => setShowRS(!showRS)}
            >
              {showRS ? 'Hide Relative Strength' : 'Show Relative Strength'}
            </Badge>
            <TradingViewModal buttonClassName={'cursor'} ticker={inputTicker} />
          </div>
          <Line
            data={settings.chartData}
            options={
              options ? { ...priceChartOptions, ...options } : priceChartOptions
            }
          />
          {showRS && (
            <RelativeStrength
              ticker={inputTicker}
              rsTicker={rsTicker}
              datePrice={datePrice}
              inputDays={settings.days}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default PriceInfo

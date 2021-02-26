
import { Fragment, useState, useEffect } from 'react'

import { priceSchema, priceChartSettings, ma5ChartSettings, ma20ChartSettings, ma60ChartSettings, dateRangeSelectAttr, maSelectAttr } from '../config/price'
import { Line } from 'react-chartjs-2';
import LoadingSpinner from './Loading/LoadingSpinner';
import Form from 'react-bootstrap/Form'
import { Badge } from 'react-bootstrap';
import { ma, ema } from 'moving-averages'

const axios = require('axios').default

function PriceInfo({ inputTicker }) {

    const [settings, setSettings] = useState(priceSchema)
    const [loading, setLoading] = useState(false)

    const handleChange = async (e) => {

        if (e.target.name == 'formYear' && parseInt(e.target.value) != parseInt(settings.days)) {
            handleTicker(inputTicker, e.target.value, settings.ma)
        }
        else if (e.target.name == 'formma' && e.target.value != settings.ma) {
            handleTicker(inputTicker, settings.days, e.target.value)
        }

    }

    const getPrice = async (inputTicker, inputDays, inputMA) => {
        if (inputTicker == undefined) return

        const dateprice = await axios(`/api/getYahooHistoryPrice?ticker=${inputTicker}&days=${parseInt(inputDays) + 60}`)
        const date = dateprice.data?.date || []
        const price = dateprice.data?.price || []
        const ma5 = inputMA == 'ma' ? ma([...price], 5) : inputMA == 'ema' ? ema([...price], 5) : []
        const ma20 = inputMA == 'ma' ? ma([...price], 20) : inputMA == 'ema' ? ema([...price], 20) : []
        const ma60 = inputMA == 'ma' ? ma([...price], 60) : inputMA == 'ema' ? ema([...price], 60) : []

        setSettings(
            {
                ticker: inputTicker,
                days: inputDays,
                ma: inputMA,
                chartData: {
                    'labels': [...date.slice(60)],
                    'datasets': [{
                        ...priceChartSettings,
                        label: inputTicker,
                        data: [...price.slice(60)],
                        showLine: inputMA == '' ? true : false,
                        pointRadius: inputMA == '' ? 0 : 3
                    }, {
                        ...ma5ChartSettings,
                        data: [...ma5.slice(60)]
                    }, {
                        ...ma20ChartSettings,
                        data: [...ma20.slice(60)]
                    }, {
                        ...ma60ChartSettings,
                        data: [...ma60.slice(60)]
                    }]
                }
            }
        )
    }

    async function handleTicker(inputTicker, inputDays, inputMA) {

        setLoading(true)
        await clearItems()
        await getPrice(inputTicker, inputDays, inputMA)
        setLoading(false)
    }

    useEffect(() => {
        handleTicker(inputTicker, settings.days, settings.ma)
    }, [inputTicker, settings.days, settings.ma])


    const clearItems = async () => {
        setSettings({
            ...settings,
            ticker: '',
            tableData: [],
            tableHeader: [],
            chartData: { 'labels': [], 'datasets': [] }
        })
    }

    return (
        <Fragment>
            {loading ?
                <LoadingSpinner /> : ''
            }
            <div style={{ display: 'inline-flex', alignItems: 'baseline' }} className="ml-1">
                <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                    <h6>
                        <Badge variant="dark">
                            <span>
                                {'In Business Days'}
                            </span>
                        </Badge>
                    </h6>
                </Form.Label>
                <Form.Control
                    {...dateRangeSelectAttr.formControl}
                    value={settings.days}
                    custom
                    onChange={(e) => handleChange(e)}
                >
                    {
                        dateRangeSelectAttr.dateRangeOptions.map(item => {
                            return <option value={item.value}>{item.label}</option>
                        })
                    }
                </Form.Control>
                <Form.Control
                    {...maSelectAttr.formControl}
                    value={settings.ma}
                    custom
                    onChange={(e) => handleChange(e)}
                >
                    {
                        maSelectAttr.maOptions.map(item => {
                            return <option value={item.value}>{item.label}</option>
                        })
                    }
                </Form.Control>
            </div>
            <Line data={settings.chartData} />
        </Fragment>
    )
}

export default PriceInfo

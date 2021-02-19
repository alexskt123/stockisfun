
import { Fragment, useState, useEffect } from 'react'

import { priceSchema } from '../config/price'
import { Line } from 'react-chartjs-2';
import LoadingSpinner from './Loading/LoadingSpinner';
import Form from 'react-bootstrap/Form'
import { Badge } from 'react-bootstrap';
import { ma, ema } from 'moving-averages'
import { BsTypeUnderline } from 'react-icons/bs';

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
        let dateprice = await axios(`/api/getYahooHistoryPrice?ticker=${inputTicker}&days=${parseInt(inputDays) + 60}`)

        let ma5 = []
        let ma20 = []
        let ma60 = [] 

        if (inputMA == 'ma') {
            ma5 = ma([...dateprice.data.price], 5)
            ma20 = ma([...dateprice.data.price], 20)
            ma60 = ma([...dateprice.data.price], 60)
            
        } else if (inputMA == 'ema') {
            ma5 = ema([...dateprice.data.price], 5)
            ma20 = ema([...dateprice.data.price], 20)
            ma60 = ema([...dateprice.data.price], 60)
        }

        setSettings(
            {
                ticker: inputTicker,
                days: inputDays,
                ma: inputMA,
                chartData: {
                    'labels': [...dateprice.data.date.slice(60)],
                    'datasets': [{
                        label: inputTicker,
                        data: [...dateprice.data.price.slice(60)],
                        fill: false,
                        backgroundColor: "rgba(30,230,230,0.2)",
                        borderColor: "rgba(30,230,230,1)",
                        showLine: inputMA == '' ? true : false,
                        pointRadius: inputMA == '' ? 0 : 3
                    }, {
                        label: '5-MA',
                        data: [...ma5.slice(60)],
                        fill: false,
                        backgroundColor: "rgba(200,12,12,0.2)",
                        borderColor: "rgba(200,12,12,1)",
                        pointRadius: 0
                    }, {
                        label: '20-MA',
                        data: [...ma20.slice(60)],
                        fill: false,
                        backgroundColor: "rgba(220,220,20,0.2)",
                        borderColor: "rgba(220,220,20,1)",
                        pointRadius: 0
                    }, {
                        label: '60-MA',
                        data: [...ma60.slice(60)],
                        fill: false,
                        backgroundColor: "rgba(75,50,10,0.2)",
                        borderColor: "rgba(75,50,10,1)",
                        pointRadius: 0
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
                    size="sm"
                    as="select"
                    className="my-1 mr-sm-2"
                    name="formYear"
                    custom
                    value={settings.days}
                    onChange={(e) => handleChange(e)}
                >
                    <option value="5">5D</option>
                    <option value="10">10D</option>
                    <option value="30">30D</option>
                    <option value="90">3M</option>
                    <option value="120">6M</option>
                    <option value="365">1Y</option>
                    <option value="1095">3Y</option>
                </Form.Control>
                <Form.Control
                    size="sm"
                    as="select"
                    className="my-1 mr-sm-2"
                    name="formma"
                    custom
                    value={settings.ma}
                    onChange={(e) => handleChange(e)}
                >
                    <option value="">N/A</option>
                    <option value="ma">MA</option>
                    <option value="ema">EMA</option>
                </Form.Control>
            </div>
            <Line data={settings.chartData} />
        </Fragment>
    )
}

export default PriceInfo

import { Fragment, useEffect, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import { trendChangeDateRangeSelectAttr, barchartOptions } from '@/config/trend'
import { randRGBColor } from '@/lib/commonFunction'
import percent from 'percent'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { Bar } from 'react-chartjs-2'

import QuoteCard from './QuoteCard'

const axios = require('axios').default

const TrendBarChart = ({ input }) => {
  const [barChartData, setBarChartData] = useState(null)
  const [days, setDays] = useState(8)

  const handleChange = async e => {
    if (e.target.name === 'formYear') {
      setDays(e.target.value)
    }
  }

  useEffect(() => {
    ;(async () => {
      const responses = await Promise.all(
        [...input].map(async item => {
          return axios
            .get(
              `/api/trend/getTrendChanges?ticker=${item.ticker}&days=${days}&isBus=false`
            )
            .catch(err => console.error(err))
        })
      ).catch(error => console.error(error))

      const changes = responses.map(item => {
        const closePrice = item?.data?.indicators?.quote.find(x => x)?.close
        const close = closePrice || []
        const start = close.find(x => x)
        const end = close.reverse().find(x => x)
        return percent.calc(end - start, start, 2)
      })

      const trendChanges = [...input].map((item, idx) => {
        return {
          ...item,
          change: changes[idx]
        }
      })

      trendChanges.sort(function (a, b) {
        return b.change - a.change
      })

      const barColors = trendChanges.map(_item => {
        const [r, g, b] = randRGBColor()

        const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`
        const borderColor = `rgba(${r}, ${g}, ${b}, 1)`
        return {
          backgroundColor,
          borderColor
        }
      })

      const data = {
        labels: trendChanges.map(item => item.label),
        datasets: [
          {
            label: 'Category',
            data: trendChanges.map(item => item.change),
            backgroundColor: barColors.map(item => item.backgroundColor),
            borderColor: barColors.map(item => item.borderColor),
            borderWidth: 1
          }
        ]
      }

      setBarChartData(data)
    })()

    return () => setBarChartData(null)
  }, [days])

  return (
    <Fragment>
      <Form inline>
        <Form.Group>
          <div
            style={{ display: 'inline-flex', alignItems: 'baseline' }}
            className="ml-1 mt-2"
          >
            <Form.Label className="my-1 mr-2">
              <h5>
                <Badge variant="dark">
                  <span>{'Range'}</span>
                </Badge>
              </h5>
            </Form.Label>
            <Form.Control
              {...trendChangeDateRangeSelectAttr.formControl}
              custom
              onChange={e => handleChange(e)}
            >
              {trendChangeDateRangeSelectAttr.dateRangeOptions.map(
                (item, index) => {
                  return (
                    <option key={`${item}${index}`} value={item.value}>
                      {item.label}
                    </option>
                  )
                }
              )}
            </Form.Control>
          </div>
        </Form.Group>
      </Form>
      {barChartData ? (
        <Fragment>
          <QuoteCard isShow={true} noClose={true}>
            <Bar data={barChartData} options={barchartOptions} />
          </QuoteCard>
        </Fragment>
      ) : (
        <GooeySpinner />
      )}
    </Fragment>
  )
}

export default TrendBarChart

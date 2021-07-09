import { Fragment, useState } from 'react'

import GooeySpinner from '@/components/Loading/GooeySpinner'
import { trendChangeDateRangeSelectAttr, barchartOptions } from '@/config/trend'
import { useTrendBarChartData } from '@/lib/hooks/charts'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { Bar } from 'react-chartjs-2'

import QuoteCard from './QuoteCard'

const TrendBarChart = ({ input }) => {
  const [days, setDays] = useState(8)
  const barChartData = useTrendBarChartData(input, days)

  const handleChange = async e => {
    if (e.target.name === 'formYear') {
      setDays(e.target.value)
    }
  }

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

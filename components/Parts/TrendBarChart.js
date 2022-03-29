import { Fragment, useState } from 'react'

import Form from 'react-bootstrap/Form'
import { Bar } from 'react-chartjs-2'

import QuoteCard from './QuoteCard'
import FormOptions from '@/components/Form/FormOptions'
import GooeySpinner from '@/components/Loading/GooeySpinner'
import { trendChangeDateRangeSelectAttr, barChartOptions } from '@/config/trend'
import { useTrendBarChartData } from '@/lib/hooks/charts'

const TrendBarChart = ({ input }) => {
  const [days, setDays] = useState(8)
  const barChartData = useTrendBarChartData(input, days)

  const handleChange = e => {
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
            <FormOptions
              formOptionSettings={trendChangeDateRangeSelectAttr}
              handleChange={handleChange}
              label={'Range'}
            />
          </div>
        </Form.Group>
      </Form>
      {barChartData ? (
        <Fragment>
          <QuoteCard isShow={true} noClose={true}>
            <Bar data={barChartData} options={barChartOptions} />
          </QuoteCard>
        </Fragment>
      ) : (
        <GooeySpinner />
      )}
    </Fragment>
  )
}

export default TrendBarChart

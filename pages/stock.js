
import { Fragment, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getIncomeStatement } from '../lib/getIncomeStatement'
import Table from 'react-bootstrap/Table'
import { CarouselItem } from 'react-bootstrap'

export default function Home() {


  const [quote, setQuote] = useState(null)
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [incomeStatementData, setIncomeStatementData] = useState([])
  const [incomeStatementHeader, setIncomeStatementHeader] = useState([])


  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { ticker } = formValue
      const incomeData = await getIncomeStatement(ticker.toUpperCase())


      let data = []

      incomeData.forEach((item, index) => {
        const compareData = incomeData[index + 1] || item

        data.push(
          {
            'Statement Date': item.date,
            'Revenue(%)': ((item.revenue - compareData.revenue) / Math.abs(compareData.revenue) * 100).toFixed(2) ,
            'Net Income(%)': ((item.netIncome - compareData.netIncome) / Math.abs(compareData.netIncome) * 100).toFixed(2),
            'R&D Expenses(%)': ((item.researchAndDevelopmentExpenses - compareData.researchAndDevelopmentExpenses) / compareData.researchAndDevelopmentExpenses * 100).toFixed(2),
            'G&A Expenses(%)': ((item.generalAndAdministrativeExpenses - compareData.generalAndAdministrativeExpenses) / compareData.generalAndAdministrativeExpenses * 100).toFixed(2),
            'S&M Expenses(%)': ((item.sellingAndMarketingExpenses - compareData.sellingAndMarketingExpenses) / compareData.sellingAndMarketingExpenses * 100).toFixed(2),
            'Net Income': item.netIncome,
            'Gross Margin(%)': (item.grossProfitRatio * 100).toFixed(2),            
            'Earning/Share': item.eps.toFixed(2)
          }
        )
      })


      //data = data.map(({ symbol, reportedCurrency, fillingDate, acceptedDate, period, ...item }) => item);


      // console.log(data)

      // data.map((item, index) => (
      //   console.log(item)
      // ))      

      let dataKeys = []
      let dataValues = []
      dataKeys = Object.keys((data || [{}] )[0])
      

      data.forEach((item, index) => {
        dataValues.push(Object.values(item))
      })


      // console.log(Object.values(data))

      setIncomeStatementHeader(dataKeys)      
      setIncomeStatementData(dataValues)

    }
    setValidated(true)
  }


  useEffect(() => {
    (async () => {

      // await yahooFinance.historical({
      //   symbol: 'AAPL',
      //   from: '2012-01-01',
      //   to: '2012-12-31',
      //   // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
      // }, function (err, quotes) {
      //   //...

      //   setQuote(quotes)
      // });


    })()

  }, [])



  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>{'Ticker'}</Form.Label>
              <Form.Control required type="ticker" name="ticker" onKeyUp={(e) => handleChange(e)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {'Go'}
            </Button>
          </Form>

          <Table responsive>
            <thead>
              <tr>
                {incomeStatementHeader.map((item, index)=> (
                  <th key={index}>{item}</th>
                ))
                }

              </tr>
            </thead>
            <tbody>

                {incomeStatementData.map((item, index) => (
                  <tr key={index}>
                    {item.map((xx,yy) => <td key={`${index}${yy}`}>{xx}</td>)}             
                  </tr>                  
                ))}

            </tbody>
          </Table>
        </Fragment>
      </Container>
    </Fragment>
  )
}

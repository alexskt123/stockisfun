
import { Fragment, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'




export default function Home() {


  const [quote, setQuote] = useState(null)


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

  console.log(quote)



  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
        </Fragment>
      </Container>
    </Fragment>
  )
}

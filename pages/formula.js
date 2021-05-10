import { Fragment } from 'react'
import dynamic from 'next/dynamic'
import Container from 'react-bootstrap/Container'
import { formulaSettings } from '../config/formula'

const FormulaCard = dynamic(
  () => {
    return import('../components/Parts/FormulaCard')
  },
  { ssr: false }
)

//export default component
export default function Formula() {

  //template
  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 rounded">
        <Fragment>
          {
            formulaSettings.map((item, idx) => {
              return <FormulaCard key={idx} content={item} />
            })
          }
        </Fragment>
      </Container>
    </Fragment>
  )
}


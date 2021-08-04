import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import LoadingSkeletonTable from '@/components/Loading/LoadingSkeletonTable'
import { toAxios } from '@/lib/request'
import { useRouter } from 'next/router'

import SearchList from './SearchList'

function Search({ list }) {
  const router = useRouter()

  return (
    <CustomContainer style={{ minHeight: '100vh' }} className="m-5 p-5">
      <Fragment>
        {router.isFallback ? (
          <LoadingSkeletonTable customSettings={[{ props: { count: 10 } }]} />
        ) : (
          <SearchList list={list} />
        )}
      </Fragment>
    </CustomContainer>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
  const { ticker } = params

  if (!ticker) {
    return { notFound: true }
  }

  try {
    const res = await toAxios(
      `http://${process.env.VERCEL_URL}/api/yahoo/getTickerSuggestions`,
      {
        query: ticker,
        filter: 'ETF,Equity'
      }
    )

    return { props: { list: res.data } }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

export default Search

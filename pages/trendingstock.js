import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import CompareSWR from '@/components/Parts/CompareSWR'
import HeaderBadge from '@/components/Parts/HeaderBadge'
import { tableHeaderList } from '@/config/trendingstock'
import { getHost } from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'

export default function TrendingStock({ trendTickers }) {
  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: 'small' }}>
        <Fragment>
          <HeaderBadge
            headerTag={'h5'}
            title={'Top 20 Trending Stocks'}
            badgeProps={{ variant: 'light' }}
          />
          <CompareSWR
            inputTickers={trendTickers}
            url={'/api/page/getTrendingStockDetail'}
            customOptions={{
              tableHeader: tableHeaderList
            }}
          />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

export async function getServerSideProps() {
  const res = await toAxios(`${getHost()}/api/yahoo/getTrending`, {})

  const { data: trendTickers } = res

  if (!trendTickers) {
    return {
      notFound: true
    }
  }

  return {
    props: { trendTickers }
  }
}

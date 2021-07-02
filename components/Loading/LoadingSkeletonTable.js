import { Fragment } from 'react'

import { loadingSkeletonColors } from '@/config/settings'
import { useLoadingSkeletonColor } from '@/lib/hooks/useLoadingSkeletonColor'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const LoadingSkeletonTable = () => {
  const colors = useLoadingSkeletonColor(loadingSkeletonColors)
  return (
    <Fragment>
      <SkeletonTheme
        color={colors.color}
        highlightColor={colors.highlightColor}
      >
        <div className="mt-1 mb-1">
          <Skeleton height={30} />
          <div className="mt-3" />
          <Skeleton count={5} />
        </div>
      </SkeletonTheme>
    </Fragment>
  )
}

export default LoadingSkeletonTable

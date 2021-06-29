import { Fragment } from 'react'

import { loadingSkeletonColors } from '@/config/settings'
import { useLoadingSkeletonColor } from '@/lib/hooks/useLoadingSkeletonColor'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const LoadingSkeleton = () => {
  const colors = useLoadingSkeletonColor(loadingSkeletonColors)
  return (
    <Fragment>
      <SkeletonTheme
        color={colors.color}
        highlightColor={colors.highlightColor}
      >
        <Skeleton />
      </SkeletonTheme>
    </Fragment>
  )
}

export default LoadingSkeleton

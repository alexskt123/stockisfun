import { Fragment } from 'react'

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { loadingSkeletonColors } from '@/config/settings'
import { useLoadingSkeletonColor } from '@/lib/hooks/useLoadingSkeletonColor'

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

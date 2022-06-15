import { Fragment } from 'react'

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { loadingSkeletonColors } from '@/config/settings'
import { useLoadingSkeletonColor } from '@/lib/hooks/useLoadingSkeletonColor'
import 'react-loading-skeleton/dist/skeleton.css'

const LoadingSkeleton = () => {
  const colors = useLoadingSkeletonColor(loadingSkeletonColors)
  return (
    <Fragment>
      <SkeletonTheme
        baseColor={colors.color}
        highlightColor={colors.highlightColor}
      >
        <Skeleton />
      </SkeletonTheme>
    </Fragment>
  )
}

export default LoadingSkeleton

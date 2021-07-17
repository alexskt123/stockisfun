import { Fragment } from 'react'

import { loadingSkeletonColors } from '@/config/settings'
import { useLoadingSkeletonColor } from '@/lib/hooks/useLoadingSkeletonColor'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const LoadingSkeletonTable = ({ customColors, customSettings }) => {
  const defaultColors = useLoadingSkeletonColor(loadingSkeletonColors)
  const colors = {
    ...defaultColors,
    ...customColors
  }
  const defaultSettings = [
    { props: { height: 30 } },
    { props: { count: 5 }, separator: 'mt-3' }
  ]
  const settings = customSettings || defaultSettings
  return (
    <Fragment>
      <SkeletonTheme
        color={colors.color}
        highlightColor={colors.highlightColor}
      >
        <div className="mt-1 mb-1">
          {settings.map((item, idx) => {
            return (
              <Fragment key={idx}>
                {item?.separator && <div className={item.separator} />}
                <Skeleton {...item.props} />
              </Fragment>
            )
          })}
        </div>
      </SkeletonTheme>
    </Fragment>
  )
}

export default LoadingSkeletonTable

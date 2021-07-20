import { useBgColor } from '@/lib/hooks/useBgColor'

export default function BgColor({
  children,

  customBgColor
}) {
  const defaultBgColor = {
    normal: 'white',
    darkMode: '#e3e3e3'
  }

  const setBgColor = {
    ...defaultBgColor,
    ...customBgColor
  }

  const bgColor = useBgColor(setBgColor.normal, setBgColor.darkMode)

  return (
    <div
      style={{
        backgroundColor: bgColor
      }}
    >
      {children}
    </div>
  )
}

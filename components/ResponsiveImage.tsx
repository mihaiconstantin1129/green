import React from 'react'

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  widths?: number[]
  sizes?: string
}

const DEFAULT_WIDTHS = [480, 800, 1200]

export default function ResponsiveImage({
  src = '',
  alt = '',
  widths = DEFAULT_WIDTHS,
  sizes = '100vw',
  ...rest
}: ResponsiveImageProps) {
  const isExternal = src.startsWith('http')
  if (isExternal) {
    return <img src={src} alt={alt} {...rest} />
  }

  const dotIndex = src.lastIndexOf('.')
  const ext = src.substring(dotIndex)
  const base = src.substring(0, dotIndex)
  const srcSet = widths.map((w) => `${base}-${w}${ext} ${w}w`).join(', ')
  const largest = Math.max(...widths)

  return (
    <img
      src={`${base}-${largest}${ext}`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      {...rest}
    />
  )
}

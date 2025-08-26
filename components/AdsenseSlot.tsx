import React from 'react'

interface Props {
  className?: string
}

export default function AdsenseSlot({ className }: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  if (!client) {
    return (
      <div className="bg-gray-100 text-center text-sm text-gray-600 p-4 my-4">
        Spațiu publicitar – Google AdSense
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Aici se inserează tagul <script> oficial AdSense */}
      {/* Aici se inserează tagul <ins> oficial AdSense */}
    </div>
  )
}

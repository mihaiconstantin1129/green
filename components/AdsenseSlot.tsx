import React from 'react'

interface Props {
  client?: string
  slot?: string
  className?: string
}

export default function AdsenseSlot({ client, slot, className }: Props) {
  if (!client) {
    return (
      <div className="bg-gray-100 text-center text-sm text-gray-600 p-4 my-4">
        Spațiu publicitar – Google AdSense
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Inserare script Google AdSense aici */}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
      />
    </div>
  )
}

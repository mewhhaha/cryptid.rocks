import React from 'react'

type PortfolioCurrencyChipProps = {
  currency: 'SEK'
}

export const PortfolioCurrencyChip: React.VFC<PortfolioCurrencyChipProps> = ({ currency }) => {
  return <span className="border mx-2 rounded-full px-2 text-gray-600">{currency}</span>
}

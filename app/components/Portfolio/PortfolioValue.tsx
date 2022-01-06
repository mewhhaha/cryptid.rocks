import React from 'react'
import { PortfolioCurrencyChip } from './PortfolioCurrency'

type PortfolioValueProps = {
  total: number
}

export const PortfolioValue: React.VFC<PortfolioValueProps> = ({ total }) => {
  return (
    <div>
      {total.toPrecision(8)}
      <PortfolioCurrencyChip currency="SEK" />
    </div>
  )
}

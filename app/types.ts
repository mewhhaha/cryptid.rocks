import type * as React from 'react'

export type Setter<A> = React.Dispatch<React.SetStateAction<A>>

export type CoinInfo = {
  id: string
  symbol: string
  name: string
}

export type PortfolioCoin = CoinInfo & {
  quantity: number
}

export type PortfolioRecord = {
  updatedAt: Date
  coins: PortfolioCoin[]
}

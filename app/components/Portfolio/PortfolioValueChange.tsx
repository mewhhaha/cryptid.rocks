import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/solid'
import React from 'react'

type PortfolioValueChangeProps = {
  change: number
}

export const PortfolioValueChange: React.VFC<PortfolioValueChangeProps> = ({ change }) => {
  if (change < 0) {
    return (
      <span className="flex justify-center flex-none text-yellow-800 bg-red-100 rounded-full px-3 w-32">
        <ArrowSmDownIcon className="w-5 h-5 self-center" />
        {`${Math.abs(change).toFixed(3)}%`}
      </span>
    )
  } else {
    return (
      <span className="flex justify-center flex-none text-green-600 bg-green-100 rounded-full px-3 w-32">
        <ArrowSmUpIcon className="w-5 h-5 self-center" />
        {`${change.toFixed(3)}%`}
      </span>
    )
  }
}

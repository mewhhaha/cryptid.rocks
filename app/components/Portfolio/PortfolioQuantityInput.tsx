import React, { useRef, useState } from "react";
import { PortfolioCoin } from "portfolio-worker";
import cn from "classnames";

type PortfolioQuantityInputProps = {
  setEntry: (entry: Partial<PortfolioCoin>) => void;
  coin: PortfolioCoin;
};

export const PortfolioQuantityInput: React.VFC<PortfolioQuantityInputProps> = ({
  setEntry,
  coin: { id, quantity, symbol },
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [quantityText, setQuantityText] = useState("");
  const [error, setError] = useState(false);

  const handleReset = () => {
    if (error) setError(false);
    if (quantityText === "") setQuantityText(quantity.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityText(e.currentTarget.value);
  };

  const handleUpdate = () => {
    const trimmed = quantityText.trim();
    const n = Number.parseFloat(trimmed);

    if (trimmed === "") {
      setQuantityText("");
    } else if (Number.isNaN(n)) {
      console.error(error);
      setError(true);
    } else {
      setEntry({ id, quantity: n });
      setQuantityText("");
    }
  };

  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        inputRef.current?.blur();
      }}
    >
      <input
        ref={inputRef}
        type="number"
        onFocus={handleReset}
        onBlur={handleUpdate}
        step="any"
        placeholder={`${quantity} ${symbol.toLocaleUpperCase()}`}
        className={cn(
          "outline-none w-32 sm:w-auto bg-gray-50 -ml-3 pl-3 pt-1 hover:bg-gray-100 focus:bg-gray-50 m-1 placeholder-gray-500 focus:ring focus:ring-blue-300 focus:placeholder-gray-300 rounded-full",
          {
            "ring-1 ring-red-600": error,
          }
        )}
        value={quantityText}
        onChange={handleChange}
      />
    </form>
  );
};

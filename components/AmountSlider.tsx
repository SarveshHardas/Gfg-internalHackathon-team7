"use client";

import { useState } from "react";

interface AmountSliderProps {
  minAmount: number;
  maxAmount: number;
  onChange: (value: number) => void;
}

export default function AmountSlider({
  minAmount,
  maxAmount,
  onChange,
}: AmountSliderProps) {
  const [amount, setAmount] = useState(minAmount);

  const update = (value: number) => {
    const newAmount = Math.min(Math.max(value, minAmount), maxAmount);
    setAmount(newAmount);
    onChange(newAmount);
  };

  return (
    <div className="w-full">
      <p className="text-gray-600 text-sm mb-2">Or choose amount</p>

      {/* Minus / Amount / Plus */}
      <div className="flex items-center justify-center gap-6 mb-3">
        <button
          onClick={() => update(amount - 10)}
          className="text-2xl font-bold text-gray-700"
        >
          –
        </button>

        <p className="text-2xl font-semibold">₹{amount}</p>

        <button
          onClick={() => update(amount + 10)}
          className="text-2xl font-bold text-gray-700"
        >
          +
        </button>
      </div>
      <input
        type="range"
        min={minAmount}
        max={maxAmount}
        value={amount}
        onChange={(e) => update(Number(e.target.value))}
        className="w-full accent-green-600 cursor-pointer"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>₹{minAmount}</span>
        <span>₹{maxAmount}</span>
      </div>
      
    </div>
  );
}

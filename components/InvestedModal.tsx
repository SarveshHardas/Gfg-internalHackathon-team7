"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  minAmount: number;
} 

export default function InvestmentModal({
  isOpen,
  onClose,
  onConfirm,
  minAmount,
}: InvestmentModalProps) {
  const [amount, setAmount] = useState(minAmount);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: any) => {
    if (e.target.id === "modal-bg") onClose();
  };

  const handleClose = () => {
    setAmount(minAmount);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(amount);
    setAmount(minAmount);
  };

  return createPortal(
    <div
      id="modal-bg"
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black/2 backdrop-blur-sm flex justify-center items-center z-[9999]"
    >
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-2xl p-6 w-full max-w-md transform transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-black/60">
          Enter Investment Amount
        </h2>
        <input
          type="number"
          value={amount}
          min={minAmount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 rounded-xl bg-white/40 backdrop-blur-lg text-black outline-none"
        />

        <div className="flex justify-center gap-2 mb-4">
          {[100, 200, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className="px-3 py-1 bg-emerald-100 rounded-lg text-sm font-medium"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            Invest
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

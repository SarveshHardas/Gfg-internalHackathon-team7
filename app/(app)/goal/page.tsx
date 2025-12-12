"use client";

import { useState } from "react";
import { auth } from "@/firebase";
import AmountSlider from "@/components/AmountSlider";
import toast from "react-hot-toast";
import Link from "next/link";

export default function GoalPlannerPage() {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [deadline, setDeadline] = useState("");
  const [recommendedAmount, setRecommendedAmount] = useState<number | null>(
    null
  );
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const handleRecommend = () => {
    if (!deadline || !targetAmount || Number(targetAmount) <= 0) {
      toast.error("Please enter target amount and deadline first.");
      return;
    }

    const today = new Date();
    const end = new Date(deadline);

    const diffDays = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) {
      toast.error("Deadline must be a future date.");
      return;
    }

    const calculated = Math.ceil(Number(targetAmount) / diffDays);

    setRecommendedAmount(calculated);
    setSelectedAmount(calculated);
  };

  const saveGoal = async () => {
    if (!auth.currentUser) {
      toast.error("Please login!");
      return;
    }

    if (!goalName || !targetAmount || !deadline || !selectedAmount) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/goals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.currentUser.uid,
          goalName,
          targetAmount,
          deadline,
          dailyAmount: selectedAmount,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (data.success) {
        toast.success("Goal saved successfully!");
      } else {
        toast.error("Failed to save goal");
      }
    } catch (err) {
      console.error(err);
      setSaving(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="px-6 md:px-20 py-10 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">🎯 AI Goal Planner</h1>
        <Link href="/GoalsList">View all goals</Link>
      </div>

      <label className="font-medium">Goal Name</label>
      <input
        type="text"
        placeholder="Ex: Buy a laptop, iPhone, Trip to Goa..."
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
        className="w-full mt-1 mb-4 p-3 border rounded-xl"
      />

      <label className="font-medium">Target Amount (₹)</label>
      <input
        type="number"
        placeholder="Enter total amount you want to save"
        value={targetAmount}
        onChange={(e) => setTargetAmount(Number(e.target.value))}
        className="w-full mt-1 mb-4 p-3 border rounded-xl"
      />

      <label className="font-medium">Deadline</label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full mt-1 mb-6 p-3 border rounded-xl"
      />

      <button
        onClick={handleRecommend}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg mb-6 hover:bg-blue-700 transition"
      >
        🤖 Suggest Saving Amount
      </button>

      {recommendedAmount && (
        <p className="text-center text-lg font-semibold text-green-600 mb-4">
          AI Suggests: Save ₹{recommendedAmount} per day
        </p>
      )}

      <AmountSlider
        minAmount={10}
        maxAmount={targetAmount ? Number(targetAmount) : 1000}
        onChange={(value) => setSelectedAmount(value)}
      />

      {goalName && targetAmount && deadline && (
        <div className="mt-8 p-5 rounded-xl border shadow-md backdrop-blur-xl bg-[rgba(255,255,255,0.35)]">
          <h2 className="text-xl font-bold mb-2">📌 Goal Summary</h2>
          <p>
            <strong>Goal:</strong> {goalName}
          </p>
          <p>
            <strong>Target:</strong> ₹{targetAmount}
          </p>
          <p>
            <strong>Deadline:</strong> {deadline}
          </p>
          <p className="mt-2 font-semibold text-green-700">
            You plan to invest: ₹{selectedAmount} per day
          </p>
        </div>
      )}
      <button
        onClick={saveGoal}
        disabled={saving}
        className="w-full mt-4 py-3 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 transition"
      >
        ⚡{""}
        {saving ? "Saving..." : "Save Goal"}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

interface Goal {
  id: string;
  goalName: string;
  targetAmount: number;
  dailyAmount: number;
  deadline: string;
  createdAt: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log("Setting up onAuthStateChanged...");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("AUTH STATE CHANGED:", user);

      if (!user) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      console.log("Fetching goals for UID:", user.uid);

      const res = await fetch("/api/goals/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await res.json();
      console.log("📥 GOALS API RESPONSE:", data);

      if (data.success) {
        setGoals(data.goals);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading goals...</p>;

  if (goals.length === 0)
    return <p className="p-6 text-lg">You haven’t set any goals yet 🚀</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <h1 className="text-3xl font-bold mb-4">Your Savings Goals</h1>

      {goals.map((goal) => {
        const today = new Date();
        const deadline = new Date(goal.deadline);

        const daysLeft = Math.ceil(
          (deadline.getTime() - today.getTime()) / 86400000
        );

        const totalDays = Math.ceil(
          (deadline.getTime() - goal.createdAt) / 86400000
        );

        const daysPassed = Math.max(totalDays - daysLeft, 0);

        const progress = Math.min(
          Math.round(
            ((goal.dailyAmount * daysPassed) / goal.targetAmount) * 100
          ),
          100
        );

        return (
          <div
            key={goal.id}
            className="p-5 rounded-xl shadow bg-white border border-gray-200 space-y-3"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{goal.goalName}</h2>
              <p className="text-sm text-gray-500">{daysLeft} days left</p>
            </div>

            <p className="text-gray-700">
              Target: <b>₹{goal.targetAmount}</b>
            </p>
            <p className="text-gray-700">
              Daily saving required: <b>₹{goal.dailyAmount}</b>
            </p>

            <div className="w-full bg-gray-200 h-3 rounded-full mt-3">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-1 text-sm text-gray-600">{progress}% completed</p>
          </div>
        );
      })}

      <button
        onClick={() => router.push("/goal")}
        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg cursor-pointer transition duration-300 ease-in-out"
      >
        Back to Set Goal
      </button>
    </div>
  );
}

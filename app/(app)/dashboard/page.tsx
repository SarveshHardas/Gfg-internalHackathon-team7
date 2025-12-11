"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";
import AnimatedLink from "@/components/AnimatedLink";
import Loading from "@/components/Loading";
import { fireConfetti } from "@/app/lib/confetti";
import MiniInvestmentGraph from "@/components/MiniInvestmentGraph";
import StreakBar from "@/components/StreakBar";
import { getInvestmentDates } from "../../lib/investmentDates";
import InvestmentCalendar from "../../../components/InvestmentCalendar";
import InvestmentModal from "@/components/InvestedModal";

interface Pack {
  id: string;
  name: string;
  amount: number;
  apy: number;
  risk: string;
  description: string;
}

export default function Dashboard() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [graphData, setGraphData] = useState<{ value: number }[]>([
    { value: 0 },
  ]);
  const [investmentDates, setInvestmentDates] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);

  useEffect(() => {
    if (!stats?.totalInvested) return;
    setGraphData((prev) => [...prev, { value: stats.totalInvested }]);
  }, [stats?.streak, stats?.totalInvested]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        return;
      }

      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.uid }),
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.user);
      }
    });

    const fetchPacks = async () => {
      try {
        const res = await fetch("/api/packs");
        const data = await res.json();

        if (data.success) {
          setPacks(data.packs);
        }
      } catch (err: any) {
        console.error("Failed to fetch packs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();

    const fetchUserStats = async () => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.user);
      }
    };
    fetchUserStats();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      if (!user) return;
      const dates = await getInvestmentDates(user.uid);
      setInvestmentDates(dates);
    };

    fetchDates();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const handleInvestment = async (packId: string, amount: number) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        toast.error("User not logged in.");
        return;
      }

      const res = await fetch("/api/investment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          packId,
          amount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          `Investment successful!\nYou invested: ₹${data.investedAmount}\nExpected Return: ₹${data.expectedReturn}`
        );

        fireConfetti();

        const res = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.uid }),
        });

        const updatedData = await res.json();
        if (updatedData.success) {
          setStats(updatedData.user);
        }
      } else {
        toast.error("Investment failed!!" + data.message);
      }
    } catch (err: any) {
      console.error("Investment error:", err);
      toast.error("Something went wrong while investing.");
    }
  };

  return (
    <div>
      <div className="px-40 py-5">
        {stats &&
          (() => {
            const last = stats.lastInvestedOn
              ? new Date(stats.lastInvestedOn).toDateString()
              : null;

            const today = new Date().toDateString();

            if (last !== today) {
              return (
                <div className="px-8 py-4 mb-4 font-semibold bg-red-50 w-fit rounded-xl grid grid-cols-[1fr_3fr_96fr]">
                  <div className="bg-red-500 rounded-2xl h-full" />
                  <div />
                  <p>
                    ⚠️ You haven&apos;t invested today — start with only ₹10
                    now!
                  </p>
                </div>
              );
            } else {
              return (
                <div className="p-4 mb-4 bg-green-50 font-semibold w-fit rounded-xl grid grid-cols-[1fr_3fr_96fr]">
                  <div className="bg-emerald-600 rounded-2xl h-full" />
                  <div />
                  <p>
                    Great, you have invested today! Keep the streak going! 🚀
                  </p>
                </div>
              );
            }
          })()}

        {stats && (
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 gap-10 mb-6">
              <div
                id="total-investment-badge"
                className="backdrop-blur-xl 
                bg-[rgba(248,113,113,0.5)] 
                border border-white/20 
                rounded-2xl 
                p-6 
                shadow-2xl 
                text-black 
                font-bold font-[Bradlens] text-lg"
              >
                <p className="mb-3">
                  💸 Total Investment: ₹{stats.totalInvested}
                </p>
                <MiniInvestmentGraph data={graphData} />
              </div>
              <div className="px-6 py-3 rounded-xl font-bold text-black row-span-2 font-[Bradlens] tracking-wider bg-blue-300">
                <p className="mb-5 font-bold text-lg text-center">
                  📅 Last invested on:{" "}
                  {stats.lastInvestedOn
                    ? new Date(stats.lastInvestedOn).toLocaleDateString()
                    : "Not Yet"}
                </p>
                <InvestmentCalendar investmentDates={investmentDates} />
              </div>

              <div
                id="streak-badge"
                className="flex justify-between items-center-safe backdrop-blur-3xl bg-[rgba(16,185,129,0.35)] border- border-white/20 rounded-2xl p-6 shadw-2xl"
              >
                <div className="h-full">
                  <p className="font-bold font-[Bradlens] text-lg">
                    ❤️‍🔥 Streak: {stats.streak}{" "}
                    {stats.streak > 1 ? "days" : "day"}
                  </p>
                </div>
                <StreakBar streak={stats.streak} />
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl mb-6 font-roboto font-bold">
          Investment Package
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="border-solid rounded-lg p-4 shadow-md bg-white hover:shadow-xl hover:translate-z-52 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{pack.name}</h2>
                {pack.risk === "low" ? (
                  <div className="rounded-full bg-green-500 w-6 h-6" />
                ) : (
                  <div className="rounded-full bg-red-700 w-6 h-6" />
                )}
              </div>
              <p>Amount: ₹{pack.amount}</p>
              <p>APY: {pack.apy}%</p>
              <p>Risk: {pack.risk}</p>
              <p className="text-sm text-gray-600 mt-2">{pack.description}</p>
              <button
                onClick={() => {
                  setSelectedPack(pack);
                  setModalOpen(true);
                }}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Invest Now
              </button>
              <AnimatedLink href={`/package/${pack.id}`}>
                <h2 className="text-xl font-semibold">Read More</h2>
              </AnimatedLink>
              <InvestmentModal
                isOpen={modalOpen}
                minAmount={selectedPack?.amount}
                onClose={() => setModalOpen(false)}
                onConfirm={(amount: number) => {
                  setModalOpen(false);
                  handleInvestment(selectedPack.id, amount);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

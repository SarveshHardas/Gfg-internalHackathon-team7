"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import ThreeDPieChart from "@/components/ThreeDPieChart";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

type ChartItem = {
  name: string;
  value: number;
};


export default function PackagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [userInvestment, setUserInvestment] = useState<number>(0);

  useEffect(() => {
    const unsubs = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const fetchPack = async () => {
      try {
        const res = await fetch(`/api/package/${id}`);
        const data = await res.json();

        if (data.success) {
          setPack(data.pack);
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPack();

    return () => unsubs();
  }, [id]);

  useEffect(() => {
    if (!user || !id) {
      return;
    }
    const fetchUserPackInvestment = async () => {
      const res = await fetch("/api/user/pack-investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, packId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setUserInvestment(data.totalInvested);
      }
    };

    fetchUserPackInvestment();
  }, [user, id]);

  const handleInvestment = async (packId: string) => {
    // for handling investment
    try {
      const user = auth.currentUser;

      if (!user) {
        toast.success("User not logged in.");
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
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          `Investment successful!\nYou invested: ₹${data.investedAmount}\nExpected Return: ₹${data.expectedReturn}`
        );

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

  const chartData: ChartItem[] =
    pack?.Splits &&
    Object.entries(pack.Splits).map(([Key, value]) => ({
      name: Key,
      value: value as number,
    }));

  if (loading) {
    return <Loading />;
  }
  if (!pack) {
    return <div className="p-10">Package data not found</div>;
  }

  return (
    <div className="p-10 flex flex-col justify-center items-center gap-7 min-h-screen">
      <div className="z-50 shadow-2xl p-14 rounded-3xl">
        <h1 className="text-3xl font-bold mb-4">{pack.name}</h1>
        <h1 className="mb-4">💸 Amount: ₹{pack.amount}</h1>
        <h1 className="mb-4">📈 APY: {pack.apy}%</h1>
        <h1 className="mb-4 flex justify-start items-center gap-2">
          {pack.risk === "low" ? (
            <div className="rounded-full bg-green-500 w-4 h-4" />
          ) : (
            <div className="rounded-full bg-red-700 w-4 h-4" />
          )}{" "}
          Risk: {pack.risk}
        </h1>
        <h1 className="text-gray-600 mb-2">Description: {pack.description}</h1>
        <div className="mt-4 p-4 rounded-lg bg-green-100 font-semibold">
          You have invested ₹{userInvestment} in this plan
        </div>
        {chartData && (
          <div className="mt-10 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Investment Split
            </h2>
            <ThreeDPieChart data={chartData} totalInvestment={userInvestment} />
            <div className="mt-6 space-y-2">
              {chartData.map((item:ChartItem) => (
                <div
                  key={item.name}
                  className="flex justify-between border-b pb-1"
                >
                  <span className="capitalize">{item.name}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center items-center mt-10 gap-10">
          <button
            onClick={() => handleInvestment(pack.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-grab transition duration-300 ease-in-out"
          >
            Invest Now
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg cursor-grab transition duration-300 ease-in-out"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

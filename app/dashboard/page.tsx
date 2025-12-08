"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedLink from "@/components/AnimatedLink";

interface Pack {
  id: string;
  name: string;
  amount: number;
  apy: number;
  risk: string;
  description: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      // for auth state change
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
      // for fetching pack details
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
      // for fetching user stats
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

  // Show loading state while fetching packs
  if (loading) {
    return <div className="p-10">Loading Investment packages...</div>;
  }

  const handleInvestment = async (packId: string) => {
    // for handling investment
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("User not logged in.");
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
        alert(
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
        alert("Investment failed!!" + data.message);
      }
    } catch (err: any) {
      console.error("Investment error:", err);
      alert("Something went wrong while investing.");
    }
  };

  return (
    <div>
      {user && (
        <div
          className="flex justify-between items-center bg-amber-100 px-8 py-4 rounded-br-3xl"
          id="navbar"
        >
          <div className="flex justify-center items-center gap-2">
            <Menu
              className="inline-block mr-4 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="absolute top-16 left-0 w-auto bg-amber-100 text-black rounded-br-3xl flex flex-col items-center gap-4 p-5">
                <a href="/profile">Profile</a>
              </div>
            )}
            <h1 className="text-2xl font-bold font-serif ">₹ Dhanify ₹</h1>
          </div>
          <div className="flex justify-center items-center gap-4 font-serif font-semibold">
            <Image
              src={user.photoURL || "/default-profile-img.png"}
              alt="Profile Image"
              width={30}
              height={30}
              className="rounded-full"
            />
            <p>{user.displayName}</p>
            <button
              onClick={async () => {
                await auth.signOut();
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <div className="p-10">
        {stats &&
          (() => {
            const last = stats.lastInvestedOn
              ? new Date(stats.lastInvestedOn).toDateString()
              : null;

            const today = new Date().toDateString();

            if (last !== today) {
              return (
                <div className="p-4 mb-4 font-semibold">
                  ⚠️ You haven&apos;t invested today — start with only ₹10 now!
                </div>
              );
            } else {
              return (
                <div className="p-4 mb-4 font-semibold">
                  Great, you have invested today! Keep the streak going! 🚀
                </div>
              );
            }
          })()}

        {stats && (
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4">
                💸 Total Investment: ₹{stats.totalInvested}
              </div>
              <div className="p-4">❤️‍🔥 Streak: {stats.streak}</div>
              <div className="p-4">
                📅 Last invested on:{" "}
                {stats.lastInvestedOn
                  ? new Date(stats.lastInvestedOn).toLocaleDateString()
                  : "Not Yet"}
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-6">Investment Package</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="border-solid rounded-lg p-4 shadow-md bg-white hover:shadow-xl transition-shadow duration-300"
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
                onClick={() => handleInvestment(pack.id)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-grab transition duration-300 ease-in-out"
              >
                Invest Now
              </button>
              <AnimatedLink href={`/package/${pack.id}`}>
                <h2 className="text-xl font-semibold">Read More</h2>
              </AnimatedLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

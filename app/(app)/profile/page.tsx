"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import Image from "next/image";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  const visibleTransactions = showAll
    ? transactions
    : transactions.slice(0, 4);

  useEffect(() => {
    console.log("✅ PROFILE COMPONENT RENDERED");

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) return;
      const userRes = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.uid }),
      });

      const userData = await userRes.json();

      if (userData.success) {
        setUser(userData.user);
      }
      const txnRes = await fetch("/api/user/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.uid }),
      });

      const txnData = await txnRes.json();

      if (txnData.success) {
        setTransactions(txnData.transactions);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-10 min-h-screen">
      {user && (
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex justify-start items-center gap-5">
            <Image
              src={user.photoUrl || "/default-profile-img.png"}
              alt="Profile Image"
              width={84}
              height={84}
              className="rounded-full"
            />
            <p className="text-2xl font-semibold">{user.email}</p>
          </div>
          <div className="z-50 shadow-2xl p-10 rounded-2xl space-y-6 mt-20">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>

            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p>
              <span className="font-semibold">Streak:</span>{" "}
              {user.streak} {user.streak > 1 ? "days" : "day"}
            </p>

            <p>
              <span className="font-semibold">Last invested on:</span>{" "}
              {user.lastInvestedOn
                ? new Date(user.lastInvestedOn).toLocaleDateString()
                : "Not yet"}
            </p>

            <p>
              <span className="font-semibold">Total Invested:</span> ₹
              {user.totalInvested}
            </p>
          </div>
          <div className="z-50 shadow-2xl rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Transactions</h2>

              {transactions.length >= 5 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-amber-600 font-semibold hover:underline"
                >
                  View All
                </button>
              )}
            </div>

            {transactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {visibleTransactions.map((txn, index) => (
                  <div
                    key={txn.id}
                    className={`flex justify-between items-center p-3 border rounded-lg transition
                    ${!showAll && index === 4 ? "opacity-40" : "opacity-100"}`}
                  >
                    <div>
                      <p className="font-semibold">{txn.packName}</p>
                      <p className="text-sm text-gray-500">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>

                    <div className="font-bold text-green-600">
                      ₹{txn.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
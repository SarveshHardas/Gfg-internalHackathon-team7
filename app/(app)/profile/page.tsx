"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import Image from "next/image";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [userInvestment, setUserInvestment] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        return;
      }

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.uid }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
      fetchUserInvestment(currentUser.uid);
    });

    const fetchUserInvestment = async (userId: string) => {
      const res = await fetch("/api/investment",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ userId })
      });
      const data = await res.json();
      if(data.success){
        setUserInvestment(data.userInvestment);
      }
    }
    return () => unsubscribe();
  }, []);

  console.log(userInvestment);

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
          <div className="border-2 border-gray-500 p-10 rounded-2xl space-y-6 mt-20">
            <p>
              <span className="font-semibold">Name:</span>{" "}{user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}{user.email}
            </p>
            <p>
              <span className="font-semibold">Streak:</span> {user.streak}{" "}
              {user.streak > 1 ? "days" : "day"}
            </p>
            <p>
              <span className="font-semibold">last invested on:</span>{" "}
              {user.lastInvestedOn
                ? new Date(user.lastInvestedOn).toLocaleDateString()
                : "not yet"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

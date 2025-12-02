"use client";

import React from "react";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300 text-black">
      <div className="flex flex-col justify-center items-center gap-7 bg-amber-100 p-5 border-black border-2 rounded-2xl max-w-auto w-full mx-[20%] sm:mx-[30%] md:mx-[35%] sm:px-3 sm:py-20">
        <h1 className="font-bold font-serif text-3xl">
          {user
            ? `Welcome, ${user.displayName}`
            : "Some error while fetching name..."}
        </h1>
        <button
          type="button"
          onClick={() => {
            signOut(auth);
            router.push("/");
          }}
          className="px-7 py-3 bg-white border-2 border-black rounded-2xl text-xl font-bold font-serif hover:bg-gray-200 hover:scale-105 transition-transform duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

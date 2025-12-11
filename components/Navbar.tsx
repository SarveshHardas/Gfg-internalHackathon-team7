"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {user && (
        <div
          className="flex justify-between items-center bg-amber-100 px-8 py-6 rounded-b-3xl"
          id="navbar"
        >
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-3xl font-extrabold ml-7 font-[Bradlens] tracking-wider">₹ Dhanify ₹</h1>
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
    </>
  );
}

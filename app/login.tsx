"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import localFont from "next/font/local";

const bradlens = localFont({
  src: "../public/fonts/bradlens.otf",
  display: "swap",
});

const antigravity = localFont({
  src: "../public/fonts/antigravity.otf",
  display: "swap",
});

const LoginPage = () => {
  const router = useRouter();
  const handleLogin = async (e?: React.MouseEvent) => {
    e?.preventDefault();

    try {
      const result = await signInWithPopup(auth, provider);
      if (!result || !result.user) {
        throw new Error("No user found! Google login failed.");
      }
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnapShot = await getDoc(userRef);

      if (!userSnapShot.exists()) {
        await setDoc(userRef, {
          name: user.displayName ?? "Anonymous",
          email: user.email ?? "No email",
          photoUrl: user.photoURL ?? "",
          streak: 0,
          lastInvested: null,
          createdAt: Date.now(),
        });
      }

      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login failed: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[linear-gradient(to_bottom_left,rgba(0,0,0,0.6),rgba(0,0,0,0.8)),url('/login-bg.jpg')] bg-cover bg-center">
      <div className="p-5 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(0,0,0,0.01))] z-60 shadow-xs shadow-black rounded-2xl max-w-auto w-full mx-[20%] sm:mx-[30%] md:mx-[35%] sm:px-3 sm:py-20">
        <form className="flex flex-col justify-center items-center gap-40 text-black text-2xl font-bold font-serif text-center">
          <h2
            className={`${bradlens.className} text-6xl bg-[linear-gradient(to_bottom,#e5e7eb_0%,#d1d5db_85%,#000_100%)] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]`}
          >
            ₹ Dhanify ₹
          </h2>
          <button
            onClick={handleLogin}
            type="button"
            id="login-btn"
            className="flex justify-center items-center gap-5 border-2 border-black rounded-lg bg-gray-100 p-2 mt-5 hover:bg-gray-200 hover:scale-105 transition-transform duration-200"
          >
            <Image
              src="/google-logo.png"
              alt="Google logo"
              width={30}
              height={30}
              className="inline-block mr-auto"
            />
            <p>Login with Google</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

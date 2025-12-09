"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {auth, provider} from "../firebase";
import {signInWithPopup} from "firebase/auth";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import toast from "react-hot-toast";

const LoginPage = () => {
    const router = useRouter();
    
    const handleLogin = async (e?:React.MouseEvent) => {
        e?.preventDefault();

        try{
            const result = await signInWithPopup(auth,provider);
            if(!result || !result.user){
                throw new Error("No user found! Google login failed.");
            }
            const user = result.user;

            const userRef = doc(db,"users",user.uid);
            const userSnapShot = await getDoc(userRef);

            if(!userSnapShot.exists()){
                await setDoc(userRef,{
                    name: user.displayName ?? "Anonymous",
                    email: user.email ?? "No email",
                    photoUrl: user.photoURL ?? "",
                    streak: 0,
                    lastInvested: null,
                    createdAt: Date.now(),
                })
            }

            router.push("/dashboard");
        }catch(error: any){
            toast.error("Login failed: "+ error.message);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="bg-amber-100 p-5 border-black border-2 rounded-2xl max-w-auto w-full mx-[20%] sm:mx-[30%] md:mx-[35%] sm:px-3 sm:py-20">
        <form className="flex flex-col justify-between items-center text-black text-2xl font-bold font-serif text-center">
          <h2>₹ Dhanify ₹</h2>
          <button
            onClick={handleLogin}
            type="button"
            id="login-btn"
            className="flex justify-center items-center gap-5 border-2 border-black rounded-lg bg-white p-2 mt-5 hover:bg-gray-200 hover:scale-105 transition-transform duration-200"
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

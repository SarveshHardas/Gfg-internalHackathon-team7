"use client";

import {useEffect} from 'react';
import {LoaderCircle} from "lucide-react";
import gsap from "gsap";

const Loading = () => {

  useEffect(()=>{
    gsap.to(".loader",{
      rotate: 360,
      duration:0.7,
      repeat:-1,
      ease:"linear"
    })
  },[])

  return (
    <div className='loader min-h-screen flex justify-center items-center'>
        <LoaderCircle size={64}/>
    </div>
  )
}

export default Loading
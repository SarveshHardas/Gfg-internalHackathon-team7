"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, User, Goal } from "lucide-react";


export default function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home /> },
    { name: "Goal", path:"/goal", icon: <Goal/> },
    { name: "Profile", path: "/profile", icon: <User /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-amber-500 z-50 flex justify-around items-center rounded-t-4xl mt-5">
      {navItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center p-2 w-full rounded-t-4xl transition-all duration-300
              ${isActive ? "bg-amber-100 text-black scale-110" : "text-white"}
            `}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

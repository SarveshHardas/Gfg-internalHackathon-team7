"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
}

const AnimatedLink = ({ href, children }: AnimatedLinkProps) => {
  const linkRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const links = document.querySelectorAll(".gsap-link");
    links.forEach((link) => {
      const underline = link.querySelector(".gsap-underline");

      link.addEventListener("mouseenter", () => {
        gsap.to(underline, {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
          transformOrigin: "left",
        });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(underline, {
          scaleX: 0,
          duration: 0.6,
          ease: "power2.out",
          transformOrigin: "right",
        });
      });
    });
  }, []);

  return (
    <Link href={href}>
    <span ref={linkRef} className="gsap-link relative inline-block cursor-pointer ml-4">
      Read More
      <span className="gsap-underline absolute left-0 -bottom-px h-0.5 w-full bg-black scale-x-0 origin-left"></span>
    </span>
    </Link>
  );
};

export default AnimatedLink;

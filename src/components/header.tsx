"use client";

import React from "react";

import Link from "next/link";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const Header = () => {
  const scrolled = useScroll(5);

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950`,
        {
          "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg": scrolled,
        },
      )}
    >
      <div className="flex h-[54px] items-center justify-between px-4 box-border">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-baseline justify-center md:hidden"
          >
            <span className="font-semibold text-xl flex">0xTools</span>
            <span className="text-xs font-medium text-[var(--main-color)]">
              by 0xbiel
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Link
            href="https://biel.codes"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-[var(--main-color)] transition"
          >
            Visit portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

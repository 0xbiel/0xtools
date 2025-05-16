"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/constants";
import { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";

const SideNav = () => {
  return (
    <div className="md:w-80 bg-white dark:bg-neutral-950 h-screen flex-1 fixed border-r border-neutral-200 dark:border-neutral-800 hidden md:flex z-30">
      <div className="flex flex-col space-y-6 w-full h-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 h-[55px] w-full border-b border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex flex-row space-x-2 items-baseline">
            <span className="font-semibold text-xl flex">0xTools</span>
            <span className="text-xs font-medium text-[var(--main-color)]">
              by 0xbiel
            </span>
          </div>
        </Link>
        <div className="flex flex-col space-y-2 md:px-6 ">
          {navItems.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const isActive =
    item.path === pathname ||
    (item.submenu && item.subMenuItems?.some((sub) => sub.path === pathname));

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center px-3 py-2 w-full justify-between transition-colors text-sm font-medium relative bg-transparent border-none`}
            style={{ boxShadow: "none" }}
          >
            <div className="flex flex-row space-x-3 items-center">
              {item.icon}
              <span
                className={`relative ${isActive ? "text-[var(--main-color)] font-bold" : "text-neutral-900 dark:text-neutral-100"} ${!isActive ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[var(--main-color)] after:transition-all after:duration-200 after:w-0 hover:after:w-full hover:text-[var(--main-color)]" : ""}`}
              >
                {item.title}
              </span>
            </div>
            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="20" height="20" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-4 flex flex-col space-y-1">
              {item.subMenuItems?.map((subItem, idx) => {
                const subActive = subItem.path === pathname;
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`pl-4 py-1 text-sm font-normal transition-colors relative bg-transparent border-none`}
                  >
                    <span
                      className={`relative ${subActive ? "text-[var(--main-color)] font-bold" : "text-neutral-900 dark:text-neutral-100"} ${!subActive ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[var(--main-color)] after:transition-all after:duration-200 after:w-0 hover:after:w-full hover:text-[var(--main-color)]" : ""}`}
                    >
                      {subItem.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-3 items-center px-3 py-2 transition-colors text-sm font-medium relative bg-transparent border-none`}
        >
          {item.icon}
          <span
            className={`relative ${isActive ? "text-[var(--main-color)] font-bold" : "text-neutral-900 dark:text-neutral-100"} ${!isActive ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[var(--main-color)] after:transition-all after:duration-200 after:w-0 hover:after:w-full hover:text-[var(--main-color)]" : ""}`}
          >
            {item.title}
          </span>
        </Link>
      )}
    </div>
  );
};

import { Icon } from "@iconify/react";
import { SideNavItem } from "@/types";

export const navItems: SideNavItem[] = [
  {
    title: "Calculators",
    path: "/",
    icon: <Icon icon="material-symbols:calculate" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      {
        title: "ETH Unit Converter",
        path: "/",
      },
      {
        title: "Token Unit Converter",
        path: "/token-calc",
      },
      {
        title: "Unix Epoch - UTC Converter",
        path: "/unix-utc",
      },
    ],
  },
];

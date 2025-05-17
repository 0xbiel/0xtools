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
      {
        title: "Base Conversion",
        path: "/base-conversion",
      },
      {
        title: "String - Bytes32 Conversion",
        path: "/string-b32-conv",
      }
    ],
  },
  {
    title: "Decoders",
    path: "/",
    icon: <Icon icon="material-symbols:code" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      {
        title: "Calldata Decoder",
        path: "/calldata-decoder",
      },
      {
        title: "Event Decoder",
        path: "/event-decoder",
      },
      {
        title: "Transaction Decoder",
        path: "/tx-decoder",
      }
    ],
  }
];

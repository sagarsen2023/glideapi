import { LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

export interface BreadCrumbItem {
  name: string;
  link: string;
  icon: ReactNode;
}

export interface DropdownMenuItem {
  title: string;
  link: string;
  icon: ReactNode;
  key: string;
  breadCrumb?: BreadCrumbItem[];
}

export interface SideMenuItem {
  title: string;
  icon: ReactNode;
  link: string;
  key: string;
  breadCrumb?: BreadCrumbItem[];
  dropdownItems?: DropdownMenuItem[];
}

export const sideMenuItems: SideMenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    link: "/",
    key: "Dashboard",
    breadCrumb: [
      {
        name: "Dashboard",
        link: "/",
        icon: <LayoutDashboard size={16} />,
      },
    ],
  },
];

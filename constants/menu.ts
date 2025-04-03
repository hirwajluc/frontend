import type { MenuData } from "~/types";

const menuDataItems: MenuData[] = [
  {
    icon: "pi pi-gauge",
    title: "Dashboard",
    url: "/dashboard",
    expanded: false,
  },
  {
    icon: "pi pi-user",
    title: "Manage Entries",
    url: "/dashboard/entries",
    expanded: false,
  },
  {
    icon: "pi pi-trophy",
    title: "Prize Management",
    url: "#",
    expanded: true,
    submenu: [
      {
        icon: "pi pi-trophy",
        title: "Prize Categories",
        url: "/dashboard/prizes/categories",
      },
      {
        icon: "pi pi-ticket",
        title: "Prize Types",
        url: "/dashboard/prizes/types",
      },
    ],
  },
  {
    icon: "pi pi-play-circle",
    title: "Trigger Draw",
    url: "/dashboard/trigger-draw",
    expanded: false,
  },
  {
    icon: "pi pi-users",
    title: "Winners ",
    url: "/dashboard/winners",
    expanded: false,
  },
  {
    icon: "pi pi-send",
    title: "Sent Messages ",
    url: "/dashboard/sent-sms",
    expanded: false,
  },
  {
    icon: "pi pi-check-circle",
    title: "Payment transactions",
    url: "/dashboard/transactions",
    expanded: false,
  },
  {
    icon: "pi pi-file",
    title: "Reports",
    url: "/dashboard/reports",
    expanded: false,
  },
];



const menuSettingDataItems: MenuData[] = [
  {
    icon: "pi pi-users",
    title: "Users",
    url: "/dashboard/users",
    expanded: false,
  },
  {
    icon: "pi pi-history",
    title: "Activity Logs",
    url: "/settings/activity-logs",
    expanded: false,
  },
  {
    icon: "pi pi-cog",
    title: "Settings",
    url: "/settings",
    expanded: false,
  },
];

export { menuDataItems, menuSettingDataItems };
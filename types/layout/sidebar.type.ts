export interface MenuType {
  data: MenuData[];
  message: string;
  status: number;
}

export interface MenuData {
  icon: string;
  title: string;
  url: string;
  badge?: null;
  badge_color?: null;
  expanded: boolean;
  submenu?: Submenu[];
}

export interface Submenu {
  icon: string;
  title: string;
  url: string;
}

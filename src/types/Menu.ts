export type Menu = {
  showBadge: boolean;
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

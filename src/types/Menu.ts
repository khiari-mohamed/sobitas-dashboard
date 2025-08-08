export type Menu = {
  showBadge: any;
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Monitor,
  Tag,
  Zap,
  Sparkles,
  Dumbbell,
  MessageSquare,
  FileText,
  Folder,
  ShoppingCart,

} from "lucide-react";

export default function SidebarControlFrontDropdown({
  isCollapsed,
  closeSidebar,
}: {
  isCollapsed: boolean;
  closeSidebar: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const items = [
    { label: "Meilleures ventes", href: "/admin/bestseller/control", icon: ShoppingCart },
    { label: "Top Promotions", href: "/admin/toppromotion/control", icon: Tag },
    { label: "Vente Flash", href: "/admin/VenteFlash/control", icon: Zap },
    { label: "Nouveautés", href: "/admin/NewArrival/control", icon: Sparkles },
    { label: "Musculation", href: "/admin/productmusculation/control", icon: Dumbbell },
    { label: "Témoignages", href: "/admin/testimonials/control", icon: MessageSquare },
    { label: "Blog", href: "/admin/blogs/control", icon: FileText },
    { label: "Catégories", href: "/admin/categories/control", icon: Folder },
    { label: "Marques", href: "/admin/brands/control", icon: Tag },
  ];

  return (
    <div>
      <button
        type="button"
        className={clsx(
          "flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-white/10 transition-colors w-full",
          isCollapsed ? "md:justify-center md:group-hover/sidebar:justify-start" : ""
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <Monitor className="w-5 h-5" />
        <span className={clsx("inline", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>
          Contrôle Front
        </span>
        <svg className="ml-auto w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open &&
        items.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={closeSidebar}
            className={clsx(
              "ml-6 flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-white/10 transition-colors",
              isCollapsed ? "md:ml-0 md:group-hover/sidebar:ml-6" : ""
            )}
          >
            <Icon className="w-4 h-4" />
            <span className={clsx("inline text-sm", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>
              {label}
            </span>
          </Link>
        ))}
    </div>
  );
}

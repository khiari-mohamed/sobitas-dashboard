"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import 
{ FileText,
  FilePlus,
  Settings,
  MapPin,
  Megaphone,
  Image,
  Tags,
  Search,
  Wrench
  
  } from "lucide-react";

export default function SidebarSiteParamsDropdown({
  isCollapsed,
  closeSidebar,
}: {
  isCollapsed: boolean;
  closeSidebar: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const items = [
    { label: "Coordonnées", href: "/admin/coordinates", icon: MapPin },
    { label: "Annonces", href: "/admin/announces", icon: Megaphone },
    { label: "Slides", href: "/admin/slides", icon: Image },
    { label: "Tags", href: "/admin/tags", icon: Tags },
    { label: "SEO Pages", href: "/admin/seo_pages", icon: Search },
    { label: "Services", href: "/admin/services", icon: Wrench },
    { label: "Reviews", href: "/admin/reviews", icon: Wrench },

   
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
        <Settings className="w-5 h-5" />
        <span className={clsx("inline", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>
          Paramètres du Site
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

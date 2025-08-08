import React from "react";
import clsx from "clsx";
import {
  Home,
  Settings,
  ShoppingBag,
  Boxes,
  Tags,
  Landmark,
  FlaskConical,
  Newspaper,
  Users,
  ShoppingCart,
  LogOut,
  FileText,
  FilePlus,
  FileSignature,
  Receipt,
  FileBadge,
  ScrollText,
  Scroll,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import SidebarSiteParamsDropdown from "@/components/SidebarSiteParamsDropdown";
import SidebarCommunicationDropdown from "@/components/SidebarCommunicationDropdown";
import SidebarControlFrontDropdown from "@/components/SidebarControlFrontDropdown";




interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  closeSidebar: () => void;
}

const navItems = [
  { label: "Accueil", icon: Home, href: "/" },
  { label: "Paramètres", icon: Settings, href: "/settings" },
  { label: "Produits", icon: ShoppingBag, href: "/produits" },
  { label: "Catégories", icon: Boxes, href: "/admin/categories" },
  { label: "Sous-catégories", icon: Tags, href: "/admin/subcategories" },
  { label: "Marques", icon: Landmark, href: "/admin/brands" },
  { label: "Aromas", icon: FlaskConical, href: "/admin/aromas" },
  { label: "Blogs", icon: Newspaper, href: "/admin/blogs" },
  { label: "Clients", icon: Users, href: "/admin/clients" },
  { label: "Commandes", icon: ShoppingCart, href: "/admin/commande" },
  { label: "FAQs", icon: HelpCircle, href: "/admin/faqs" },
  { label: "Pages", icon: FileText, href: "/admin/pages" },
  { label: "media", icon: FileText, href: "/admin/media" },
  { label: "Paiements", icon: CreditCard, href: "/admin/payments" },
  { label: "Packs", icon: CreditCard, href: "/admin/packs" },
  

];

function SidebarFactureDropdown({
  isCollapsed,
  closeSidebar,
}: {
  isCollapsed: boolean;
  closeSidebar: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const items = [
    { label: "Factures", href: "/admin/facture", icon: FileText },
    { label: "Bons de Commande", href: "/admin/facture?tab=bon-commande", icon: FilePlus },
    { label: "Bons de Livraison", href: "/admin/facture?tab=bon-livraison", icon: FileSignature },
    { label: "Devis", href: "/admin/facture?tab=devis", icon: FileBadge },
    { label: "Facture Client", href: "/admin/facture?tab=facture-client", icon: ScrollText },
    { label: "Facture Boutique", href: "/admin/facture?tab=facture-boutique", icon: Scroll },
    { label: "Ticket de Caisse", href: "/admin/facture?tab=ticket-caisse", icon: Receipt },
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
        <FileText className="w-5 h-5" />
        <span className={clsx("inline", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>
          Factures & Documents
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

export default function Sidebar({ isOpen, isCollapsed, closeSidebar }: SidebarProps) {
  const navWidth = isCollapsed ? "md:w-[60px] w-[250px]" : "w-[250px]";

  return (
    <div className="group/sidebar relative">
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-sidebar text-white flex flex-col transition-all duration-300",
          navWidth,
          {
            "translate-x-0 md:translate-x-0": isOpen,
            "-translate-x-full md:translate-x-0": !isOpen,
          },
          "md:group-hover/sidebar:w-[250px]"
        )}
      >
        {/* Header */}
        <div className="h-[60px] flex items-center gap-3 px-4 border-b border-white/10" style={{ background: "#28a4f4" }}>
          {!isCollapsed ? (
            <>
              <div className="relative w-8 h-8">
                <img
                  src="http://admin.protein.tn/storage/app/public/settings/October2023/xgBedJ1hQlBr0fBZXI3Q.png"
                  alt="Logo"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold">SOBITAS</span>
            </>
          ) : (
            <>
              <div className="mx-auto md:group-hover/sidebar:hidden hidden md:block">
                <img
                  src="http://admin.protein.tn/storage/app/public/settings/October2023/xgBedJ1hQlBr0fBZXI3Q.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="md:hidden flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <img
                    src="http://admin.protein.tn/storage/app/public/settings/October2023/xgBedJ1hQlBr0fBZXI3Q.png"
                    alt="Logo"
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold">SOBITAS</span>
              </div>
              <div className="hidden md:group-hover/sidebar:flex items-center gap-3 px-4 absolute">
                <div className="relative w-8 h-8">
                  <img
                    src="http://admin.protein.tn/storage/app/public/settings/October2023/xgBedJ1hQlBr0fBZXI3Q.png"
                    alt="Logo"
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold">SOBITAS</span>
              </div>
            </>
          )}
        </div>

        {/* Banner */}
        <div className={clsx("relative h-[80px] w-full", isCollapsed && "md:group-hover/sidebar:block")}>
          <img src="/soitas.webp" alt="Sidebar Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div
            className={clsx(
              "absolute left-4 bottom-2 flex items-center gap-3 z-10 transition-all duration-300",
              isCollapsed
                ? "md:left-1/2 md:-translate-x-1/2 md:flex-col md:gap-0 md:group-hover/sidebar:left-4 md:group-hover/sidebar:translate-x-0 md:group-hover/sidebar:flex-row md:group-hover/sidebar:gap-3"
                : ""
            )}
          >
            <img
              src="http://admin.protein.tn/storage/app/public/users/December2023/EkN5JZXYobB1crSOkNhW.jpg"
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-white"
            />
            <div className={clsx("flex flex-col leading-tight", isCollapsed ? "md:hidden md:group-hover/sidebar:flex" : "")}>
              <span className="text-sm font-semibold text-white">SOBITAS</span>
              <span className="text-xs text-white/70">webmaster@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-white/10 transition-colors justify-start",
                isCollapsed ? "md:justify-center md:group-hover/sidebar:justify-start" : ""
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={clsx("inline", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>
                {label}
              </span>
            </Link>
          ))}
          <SidebarFactureDropdown isCollapsed={isCollapsed} closeSidebar={closeSidebar} />
          <SidebarSiteParamsDropdown isCollapsed={isCollapsed} closeSidebar={closeSidebar} />
          <SidebarCommunicationDropdown isCollapsed={isCollapsed} closeSidebar={closeSidebar} />
          <SidebarControlFrontDropdown isCollapsed={isCollapsed} closeSidebar={closeSidebar} />

        </nav>

        {/* Logout */}
        <div className={clsx("px-3 pb-6 flex justify-start", isCollapsed ? "md:justify-center md:group-hover/sidebar:justify-start" : "")}>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className={clsx("inline", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>Déconnexion</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

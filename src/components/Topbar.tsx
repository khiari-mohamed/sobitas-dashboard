'use client';

import { Menu, X, User, Home, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  isCollapsed: boolean;
}

const actionButtons = [
  { label: "+ Ajouter Ticket", color: "bg-green-500", href: "#" },
  { label: "+ Ajouter BC", color: "bg-sky-500", href: "#" },
  { label: "+ Ajouter Facture (TVA)", color: "bg-red-600", href: "#" },
  { label: "+ Ajouter Client", color: "bg-orange-400", href: "#" },
  { label: "+ Ajouter Produit", color: "bg-amber-700", href: "#" },
  { label: "+ Ajouter Blog", color: "bg-emerald-500", href: "#" },
];

export default function Topbar({
  sidebarOpen,
  toggleSidebar,
  toggleCollapse,
  isCollapsed,
}: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-auto bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left: menu, breadcrumb, and buttons */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
        {/* Sidebar toggles */}
        <div className="flex items-center gap-4">
          {/* Mobile burger */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 text-gray-700 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop toggle collapse */}
          <button
            onClick={toggleCollapse}
            className="hidden md:inline-flex p-2 text-gray-700 hover:text-black transition"
            aria-label="Réduire la barre latérale"
          >
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

          {/* Breadcrumb */}
          <ol className="hidden md:flex text-sm text-gray-600">
            <li className="flex items-center gap-1">
              <i className="voyager-boat" /> Tableau de bord
            </li>
          </ol>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 md:ml-4">
          {actionButtons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.href}
              className={`text-white font-medium px-4 py-2 rounded ${btn.color} hover:opacity-90 transition whitespace-nowrap text-sm`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User dropdown */}
      <div className="relative mt-2 md:mt-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src="http://admin.protein.tn/storage/app/public/users/December2023/EkN5JZXYobB1crSOkNhW.jpg"
            alt="Profil"
            width={36}
            height={36}
            className="rounded-full border"
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border text-sm">
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-gray-900">SOBITAS</p>
              <p className="text-gray-500 text-xs">webmaster@gmail.com</p>
            </div>
            <div className="flex flex-col">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                Profil
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <Home className="w-4 h-4 text-gray-500" />
                Accueil
              </Link>
              <button
                className="flex items-center justify-center gap-2 mt-2 px-4 py-2 text-white text-sm font-medium bg-[#FF4500] hover:bg-orange-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

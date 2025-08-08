"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  MessageSquare,
  Mail,
  MailCheck,
  Phone,
  Send,
  Inbox,
} from "lucide-react";

export default function SidebarCommunicationDropdown({
  isCollapsed,
  closeSidebar,
}: {
  isCollapsed: boolean;
  closeSidebar: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const items = [
    { label: "Contact", href: "/admin/contact", icon: MessageSquare },
    { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { label: "Templates Email", href: "/admin/email_templates", icon: MailCheck },
    { label: "SMS", href: "/admin/sms", icon: Phone },
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
        <Send className="w-5 h-5" />
        <span className={clsx("inline", isCollapsed ? "md:hidden md:group-hover/sidebar:inline" : "")}>
          Communication
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { GraduationCap, HomeIcon, Mail } from "lucide-react";

const navigationItems = [
  { id: "home", text: "Hjem", to: "/", icon: <HomeIcon className="h-5 w-5" /> },
  {
    id: "studiene",
    text: "Studiene",
    to: "/studiene",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "kontakt",
    text: "Kontakt",
    to: "/kontakt",
    icon: <Mail className="h-5 w-5" />,
  },
];

const BottomBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 w-full z-30 bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-8 py-2">
        {navigationItems.map((navigationItem) => (
          <Link
            key={navigationItem.id}
            href={navigationItem.to}
            className={clsx(
              "flex flex-col items-center text-xs font-medium transition-colors",
              pathname === navigationItem.to
                ? "font-bold text-foreground-primary"
                : "text-foreground-secondary"
            )}
          >
            {navigationItem.icon}
            <span>{navigationItem.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;

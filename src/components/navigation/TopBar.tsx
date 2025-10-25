"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import FondetLogo from "../miscellaneous/FondetLogo";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navigationItems = [
  { id: "home", text: "Hjem", to: "/" },
  { id: "studiene", text: "Studiene", to: "/studiene" },
  { id: "kontakt", text: "Kontakt", to: "/kontakt" },
];

const TopBar: React.FC = () => {
  const [isOnTop, setIsOnTop] = useState(true);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsOnTop(window.scrollY < 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Use resolvedTheme directly - this will always be 'light' or 'dark'
  const isDarkMode = resolvedTheme === "dark";

  return (
    <header
      className={clsx(
        "fixed z-30 w-full top-0 transition-all duration-150 backdrop-blur-md",
        isOnTop ? "bg-transparent" : "bg-background/95 dark:bg-background/60"
      )}
    >
      <nav className="grid grid-cols-2 sm:grid-cols-3 items-center py-3 px-4 sm:px-8 w-full">
        <Link
          href="/"
          aria-label="Til forsiden"
          className="text-logo font-bold text-2xl flex items-center justify-self-start gap-2"
        >
          <FondetLogo size="large" className="w-32 sm:w-44 h-auto" />
        </Link>
        <div className="hidden sm:flex gap-8 justify-self-center">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.to}
              className={clsx(
                "text-sm font-medium transition-colors text-foreground-secondary hover:text-foreground-primary",
                pathname === item.to ? "font-bold text-foreground-primary" : ""
              )}
            >
              {item.text}
            </Link>
          ))}
        </div>
        <div className="flex gap-4 justify-self-end items-center">
          <Link
            href="https://tihlde.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors text-foreground-secondary hover:text-foreground-primary"
          >
            Til hovedsiden
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            key={`theme-${theme}-${resolvedTheme}`}
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6 cursor-pointer transition-colors text-foreground-secondary hover:text-foreground-primary" />
            ) : (
              <MoonIcon className="h-6 w-6 cursor-pointer transition-colors text-foreground-secondary hover:text-foreground-primary" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default TopBar;

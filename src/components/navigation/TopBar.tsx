"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import TihldeLogo from "../miscellaneous/TihldeLogo";
import { MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navigationItems = [
  { id: "hjem", text: "Hjem", to: "/" },
  { id: "apply", text: "Søk om støtte", to: "/apply" },
  { id: "about", text: "Om fondet", to: "/about" },
  { id: "reports", text: "Rapporter", to: "/reports" },
  { id: "group", text: "Forvaltningsgruppen", to: "/group" },
];

const TopBar: React.FC = () => {
  const [isOnTop, setIsOnTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsOnTop(window.scrollY < 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
        isOnTop && !menuOpen
          ? "bg-transparent"
          : "bg-background/95 dark:bg-background/80"
      )}
    >
      <nav className="flex items-center justify-between gap-4 py-3 px-4 sm:px-8 w-full">
        <Link
          href="/"
          aria-label="Til forsiden"
          className="text-logo font-bold text-2xl flex items-center gap-2 shrink-0"
        >
          <TihldeLogo size="large" className="w-32 sm:w-40 h-auto" />
        </Link>
        <div className="hidden lg:flex gap-8 whitespace-nowrap">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.to}
              className={clsx(
                "text-sm font-medium transition-colors text-foreground-secondary hover:text-foreground-primary py-3 -my-3",
                (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to))
                  ? "font-bold text-foreground-primary"
                  : ""
              )}
            >
              {item.text}
            </Link>
          ))}
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <a
            href="https://tihlde.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline text-sm font-medium transition-colors text-foreground-secondary hover:text-foreground-primary whitespace-nowrap py-3 -my-3"
          >
            Til hovedsiden
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Bytt fargetema"
            className="p-2.5 -m-2.5"
            key={`theme-${theme}-${resolvedTheme}`}
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6 cursor-pointer transition-colors text-foreground-secondary hover:text-foreground-primary" />
            ) : (
              <MoonIcon className="h-6 w-6 cursor-pointer transition-colors text-foreground-secondary hover:text-foreground-primary" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 -m-2 text-foreground-secondary hover:text-foreground-primary transition-colors"
          >
            {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="lg:hidden flex flex-col px-4 sm:px-8 pb-4 gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.to}
              className={clsx(
                "py-3 px-2 rounded-md text-base font-medium transition-colors text-foreground-secondary hover:text-foreground-primary hover:bg-cardBackground",
                (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to))
                  ? "font-bold text-foreground-primary"
                  : ""
              )}
            >
              {item.text}
            </Link>
          ))}
          <a
            href="https://tihlde.org"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-2 rounded-md text-base font-medium transition-colors text-foreground-secondary hover:text-foreground-primary hover:bg-cardBackground"
          >
            Til hovedsiden
          </a>
        </div>
      )}
    </header>
  );
};

export default TopBar;

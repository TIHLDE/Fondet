"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-sidebar-background shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - always visible */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-sidebar-foreground hover:text-muted-foreground transition-colors"
          >
            {/* Logo */}
            <div className="w-8 h-8 relative">
              <Image
                src="/fund_logo.png"
                alt="TIHLDE Fondet Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            {/* TIHLDE Fondet text with line break */}
            <div className="text-left">
              <div className="text-sm font-medium leading-tight">TIHLDE</div>
              <div className="text-xs font-light">Fondet</div>
            </div>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-green-400 font-semibold hover:text-green-300 transition-colors"
            >
              Portefølje
            </Link>
            <Link
              href="/apply"
              className="text-sidebar-foreground font-medium hover:text-muted-foreground transition-colors"
            >
              Søk om støtte
            </Link>
            <Link
              href="/about"
              className="text-sidebar-foreground font-medium hover:text-muted-foreground transition-colors"
            >
              Om fondet
            </Link>
            <Link
              href="/reports"
              className="text-sidebar-foreground font-medium hover:text-muted-foreground transition-colors"
            >
              Rapporter
            </Link>
            <Link
              href="/group"
              className="text-sidebar-foreground font-medium hover:text-muted-foreground transition-colors"
            >
              Forvaltningsgruppen
            </Link>
          </div>

          {/* Desktop TIHLDE.ORG - hidden on mobile */}
          <div className="hidden md:flex items-center">
            <a
              href="https://tihlde.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sidebar-foreground font-bold text-lg hover:text-muted-foreground transition-colors"
            >
              TIHLDE.ORG
            </a>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-sidebar-foreground hover:text-muted-foreground focus:outline-none focus:text-muted-foreground"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - shown when hamburger is clicked */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sidebar-background border-t border-border">
              <Link
                href="/"
                className="block px-3 py-2 text-green-400 font-semibold hover:text-green-300 hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Portefølje
              </Link>
              <Link
                href="/apply"
                className="block px-3 py-2 text-sidebar-foreground font-medium hover:text-muted-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Søk om støtte
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-sidebar-foreground font-medium hover:text-muted-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Om fondet
              </Link>
              <Link
                href="/reports"
                className="block px-3 py-2 text-sidebar-foreground font-medium hover:text-muted-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Rapporter
              </Link>
              <Link
                href="/group"
                className="block px-3 py-2 text-sidebar-foreground font-medium hover:text-muted-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Forvaltningsgruppen
              </Link>
              <a
                href="https://tihlde.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sidebar-foreground font-bold text-lg hover:text-muted-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                TIHLDE.ORG
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

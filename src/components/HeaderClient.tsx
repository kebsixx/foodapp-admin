"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { Meow_Script } from "next/font/google";

const meow = Meow_Script({
  subsets: ["latin"],
  weight: ["400"],
});

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function untuk memastikan overflow kembali normal
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useOnClickOutside(menuRef, (event) => {
    if (isOpen && !hamburgerRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className={`${meow.className} text-4xl font-extrabold text-[#6fc483]`}
          onClick={() => setIsOpen(false)}>
          cerita senja
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden gap-6 md:flex">
          <NavLinks onClickLink={() => {}} />
        </nav>

        {/* Tombol Hamburger untuk Mobile */}
        <div className="md:hidden">
          <button
            ref={hamburgerRef}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            type="button">
            {isOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Menu Overlay untuk Mobile */}
      <div
        ref={menuRef}
        className={`
          absolute left-0 w-full origin-top transform bg-background shadow-lg transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "scale-y-100" : "scale-y-0"}
        `}>
        <nav className="flex flex-col gap-4 p-6">
          <NavLinks onClickLink={() => setIsOpen(false)} />
        </nav>
      </div>
    </header>
  );
};

export default Header;

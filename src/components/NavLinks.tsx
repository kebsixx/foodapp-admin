"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  onClickLink?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ onClickLink = () => {} }) => {
  const pathname = usePathname();

  const links = [
    { label: "Services", href: "#services" },
    { label: "Menu", href: "#menu" },
    { label: "Testimonials", href: "#testimonial" },
    { label: "Feedback", href: "#feedback" },
    { label: "Contact", href: "#contact" },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      const targetId = href.replace(/.*#/, "");
      const elem = document.getElementById(targetId);
      elem?.scrollIntoView({ behavior: "smooth" });
      onClickLink();
    }
  };

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={(e) => handleScroll(e, link.href)}
          className="block py-2 text-lg text-muted-foreground transition-colors hover:text-primary md:py-0 md:text-sm">
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;

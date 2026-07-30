"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/providers/auth-provider";

const navLinks = [
  { name: "Map", href: "/map", icon: "/map_icon.svg" },
  { name: "Trails", href: "/trails", icon: "/map_icon.svg" },
  { name: "Lodges", href: "/lodges", icon: "/lodge_icon.svg" },
  { name: "Saved", href: "/saved", icon: "/bookmark_icon.svg" },
  { name: "Profile", href: "/profile", icon: "/profile_icon.svg" },
];

const NavBar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        Hokie<span>Trails</span>
      </Link>
      <nav>
        <ul>
          {navLinks.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link href={item.href} className={active ? "active" : ""}>
                  <Image src={item.icon} alt="" width={22} height={22} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-footer">
        {user ? `Signed in as ${user.username}` : "Explore Virginia's trails"}
      </div>
    </aside>
  );
};

export { NavBar };

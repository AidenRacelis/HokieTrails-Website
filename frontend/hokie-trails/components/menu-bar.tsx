'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
    
    const navLinks = [
        {
            name: "Map",
            href: "/map"
        },
        {
            name: "Lodges",
            href: "/lodges"
        },

        {
            name: "Saved",
            href: "/saved"
        },

        {
            name: "Profile",
            href: "/profile"
        }
    ]

    const pathname = usePathname();
    return (
        <nav>
            <ul>
                {navLinks.map((item) => (
                    <li key={item.href}>
                    <Link href={item.href} className={pathname === item.href ? 'active' : ''}>
                        {item.name}
                    </Link>
                    </li>
                ))}
            </ul>
        </nav>

    )
}

export {NavBar} ;
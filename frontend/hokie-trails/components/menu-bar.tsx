'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


const NavBar = () => {
    
    const navLinks = [
        {
            name: "Map",
            href: "/map",
            icon: "map_icon.svg"
            
        },
        {
            name: "Lodges",
            href: "/lodges",
            icon: "lodge_icon.svg"
            
        },

        {
            name: "Saved",
            href: "/saved",
            icon: "bookmark_icon.svg"
        },

        {
            name: "Profile",
            href: "/profile",
            icon: "profile_icon.svg"
        }
    ]

    const pathname = usePathname();
    return (
        <nav>
            <ul>
                {navLinks.map((item) => (
                    <li key={item.href}>
                    <Link href={item.href} className={pathname === item.href ? 'active' : ''}>
                        <Image src = {item.icon} alt = "Icon" width= {30} height={30}></Image>
                        {item.name}
                    </Link>
                    </li>
                ))}
            </ul>
        </nav>

    )
}

export {NavBar} ;
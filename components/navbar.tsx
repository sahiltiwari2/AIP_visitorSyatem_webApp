'use client'
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { User } from "firebase/auth";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full border-2 border-black rounded-md fixed bottom-0 left-0 z-50">
      <NextUINavbar maxWidth="full">
        <NavbarContent className="w-full">
          <div className="flex justify-center items-center gap-24 w-full">
            {siteConfig.navItems.map((item) => {
              if (item.label === "Login" && user) {
                return (
                  <NavbarItem key="profile">
                    <NextLink href="/profile" className="flex items-center gap-2">
                      <item.icon size={20} /> Profile
                    </NextLink>
                  </NavbarItem>
                );
              }

              return (
                <NavbarItem key={item.href}>
                  <NextLink href={item.href} className="flex items-center gap-2">
                    <item.icon size={20} /> {item.label}
                  </NextLink>
                </NavbarItem>
              );
            })}
          </div>
        </NavbarContent>
      </NextUINavbar>
    </div>
  );
};

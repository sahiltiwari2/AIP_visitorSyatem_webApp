'use client'
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { User } from "firebase/auth"; // Adjust this import to your Firebase setup
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
    // Listen for Firebase Auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full border-2 border-black rounded-md fixed bottom-0 left-0 z-50">
      <NextUINavbar maxWidth="full">
        <NavbarContent className="w-full">
          <div className="flex justify-center items-center gap-24 w-full">
            {siteConfig.navItems.map((item) => {
              // Replace "Login" with "Profile" if the user is logged in
              if (item.label === "Login" && user) {
                return (
                  <NavbarItem key="profile">
                    <NextLink href="/profile">
                      Profile
                    </NextLink>
                  </NavbarItem>
                );
              }

              return (
                <NavbarItem key={item.href}>
                  <NextLink href={item.href}>{item.label}</NextLink>
                </NavbarItem>
              );
            })}
          </div>
        </NavbarContent>
      </NextUINavbar>
    </div>
  );
};

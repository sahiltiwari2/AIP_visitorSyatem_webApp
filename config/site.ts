import {
  AiOutlineHome,
  AiOutlineForm,
  AiOutlineLogin,
  AiOutlineDashboard,
  AiOutlineUser,
} from "react-icons/ai";

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: AiOutlineHome, // Pass the component reference, not a JSX element
    },
    {
      label: "Form",
      href: "/form",
      icon: AiOutlineForm,
    },
    {
      label: "Login",
      href: "/login",
      icon: AiOutlineLogin,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: AiOutlineDashboard,
    },
    {
      label: "Visitor",
      href: "/visitor",
      icon: AiOutlineUser,
    },
  ],
};

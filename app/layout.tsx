import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import TopBar from "@/components/topBar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col min-h-screen">
            <main className="container w-full flex-grow pb-16">
              {children}
            </main>
            <Navbar /> 
          </div>
        </Providers>
      </body>
    </html>
  );
}


// import "@/styles/globals.css";
// import { Metadata } from "next";
// import clsx from "clsx";

// import { Providers } from "./providers";
// import { siteConfig } from "@/config/site";
// import { fontSans } from "@/config/fonts";
// import { Navbar } from "@/components/navbar";
// import TopBar from "@/components/topBar";

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html suppressHydrationWarning lang="en">
//       <head />
//       <body
//         className={clsx(
//           "min-h-screen bg-background font-sans antialiased",
//           fontSans.variable
//         )}
//       >
//         <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
//           <div className="relative flex flex-col min-h-screen">
//             {/* Main content */}
//             <main className="container w-full flex-grow pb-16 lg:pt-[72px]">
//               {/* The padding at the top ensures content doesn't get hidden behind the navbar on large screens */}
//               {children}
//             </main>
//             <Navbar /> 
//           </div>
//         </Providers>
//       </body>
//     </html>
//   );
// }

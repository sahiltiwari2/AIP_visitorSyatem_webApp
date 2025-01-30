'use client'
import Logo from "@/public/AIPlogo.svg";
import Image from "next/image";
import TopBar from "@/components/topBar";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import IMage from "@/public/vercel.svg"
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <div className="w-screen">
      <TopBar pageName="Home" />
      <div className="pt-10 pl-10 font-bold text-2xl">
        Welcome to AIP
      </div>
      <div className="pl-10 pt-3">
        Abilities was founded in 1968 by Mr. R.S. Arora, initially focusing on manufacturing pistons and related components for the domestic
        two-wheeler replacement market. In 1994, the company expanded to supply OEMs in the two- and three-wheeler segments, serving notable
        clients like TVS and Greaves, while beginning exports to Italy. The manufacturing facilities have been upgraded multiple times since
        1995 to meet international standards, and now nearly 50% of their output is exported to 35 countries.
      </div>
      <div className="w-full h-[350px] flex items-center justify-center text-3xl font-extrabold mt-12 mb-12">
        <div
          style={{
            position: 'relative',
            width: '50vw',
            height: '40vh',
            overflow: 'hidden', 
          }}
        >
          <video
            src="/homeVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '110%', // Slightly stretch the width
              height: '100%', // Slightly stretch the height
              objectFit: 'cover', // Make the video fill the container while allowing minor stretching
              pointerEvents: 'none', // Disable user interaction
            }}
          />
        </div>

      </div>



      <div className="pl-10 pt-3">
        The company has built a strong reputation, attracting consistent orders and inquiries from domestic and international clients.
        Abilities offers competitive pricing and quality as an OEM supplier to China and Japan. They received financial support from DSIR
        for R&D, successfully implementing a new production process for pistons. Today, Abilities India Piston and Ring Ltd. is synonymous
        with reliability and value, with a diverse product range and significant global presence since its first export order in 1993. Their
        eco-friendly infrastructure spans 20,000 sq m, featuring ISO certifications and a dedicated R&D center.
      </div>
      <div className="w-screen px-10 pt-10">
        <Button style={{ background: '#17C6ED' }} className="w-full text-white text-xl h-12 " as={Link} href="/form">
          Book an Appointment
        </Button>

      </div>
    </div>
  );
}

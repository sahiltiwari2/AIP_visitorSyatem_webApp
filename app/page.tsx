import Logo from "@/public/AIPlogo.svg";
import Image from "next/image";
import TopBar from "@/components/topBar";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import IMage from "@/public/vercel.svg"

export default function Home() {
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
      <div className="w-full h-[250px] border-2 flex items-center justify-center text-3xl font-extrabold ">
      <video
          className="w-full h-full object-cover"
          controls
          autoPlay
          loop
          muted
        >
          <source src="/homeVid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="pl-10 pt-3">
        The company has built a strong reputation, attracting consistent orders and inquiries from domestic and international clients.
        Abilities offers competitive pricing and quality as an OEM supplier to China and Japan. They received financial support from DSIR
        for R&D, successfully implementing a new production process for pistons. Today, Abilities India Piston and Ring Ltd. is synonymous
        with reliability and value, with a diverse product range and significant global presence since its first export order in 1993. Their
        eco-friendly infrastructure spans 20,000 sq m, featuring ISO certifications and a dedicated R&D center.
      </div>
      <div className="w-screen px-10 pt-10">
        <Button style={{background: '#17C6ED'}} className="w-full text-white text-xl h-12 " as={Link} href="/form">
        Book an Appointment
        </Button>
        
      </div>
    </div>
  );
}

import Logo from "@/public/AIPlogo.svg";
import Image from "next/image";

export default function Home() {
  return (
    <div className=' px-20 py-5'>
        <Image src={Logo} alt='Logo'/>
    </div>
  );
}
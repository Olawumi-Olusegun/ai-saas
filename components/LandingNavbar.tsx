"use client";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const montserrat = Montserrat({subsets: ["latin"], weight: "600"});

 const LandingNavbar = () => {

    const {isSignedIn} = useAuth();

    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-4">
                    <Image fill alt="logo" src="/logo.png" />
                </div>
                <h1 className={cn("text-2xl font-bold text-white", montserrat.className)}>Genius</h1>
            </Link>
            <div className="flex items-center gap-x-4">
                <Link href={isSignedIn ? "/dashboard" : "signin"} >
                    <Button className="rounded-full" variant="outline">Signin</Button>
                </Link>
                <Link href={isSignedIn ? "/dashboard" : "signup"} >
                    <Button className="rounded-full" variant="premium">Get Started</Button>
                </Link>
            </div>
        </nav>
    )

}

export default LandingNavbar;
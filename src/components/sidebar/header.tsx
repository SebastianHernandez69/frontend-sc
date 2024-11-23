"use client"

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import DropdownProfile from "./drop-menu";
import RouteGuard from "../routeGuard";
import { useUserContext } from "@/context/UserContext";


const Header = () => {
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();
    const {user } = useUserContext();

    return (
        <RouteGuard>
            <div
                className={cn(
                    `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 bg-blue-500`,
                    {
                    'border-b border-gray-200 bg-blue-500/90 backdrop-blur-sm': scrolled,
                    'border-b border-gray-200 bg-blue-500': selectedLayout,
                    },
                )}
                >
                <div className="flex h-[47px] items-center justify-between px-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/home"
                            className="flex flex-row space-x-3 items-center justify-center md:hidden"
                        >
                            <img src="/images/logo-sc.png" className="w-10" alt="" />
                            <span className="font-bold text-xl flex text-white">SharkCat</span>
                        </Link>
                    </div>

                        <div className="hidden md:block">
                        <div className="h-10 w-10 rounded-full  flex items-center justify-center text-center">
                            <DropdownProfile profilePhoto={user?.fotoPerfil}/>
                        </div>
                    </div>
                </div>
            </div>
        </RouteGuard>
        
    )
}

export default Header;
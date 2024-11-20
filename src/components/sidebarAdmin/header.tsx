"use client"

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import RouteGuard from "../routeGuard";


const Header = () => {
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

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
                            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
                            <span className="font-bold text-xl flex text-white">SharkCat</span>
                        </Link>
                    </div>

                        <div className="hidden md:block">
                        
                    </div>
                </div>
            </div>
        </RouteGuard>
        
    )
}

export default Header;
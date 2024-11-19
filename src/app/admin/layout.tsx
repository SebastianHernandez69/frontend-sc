import React from "react";
import Navbar from "@/components/navBar";
import Header from "@/components/sidebarAdmin/header";
import HeaderMobile from "@/components/sidebarAdmin/header-mobile";
import SideNav from "@/components/sidebarAdmin/side-nav";
import PageWrapper from "@/components/sidebarAdmin/page-wrapper";
import MarginWidthWrapper from "@/components/sidebarAdmin/margin-width-wrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>   
            <div className="flex">
                <SideNav />
                <main className="flex-1">
                    <MarginWidthWrapper>
                        <Header />
                        <HeaderMobile />
                        <PageWrapper>
                            {children}
                            <ToastContainer />
                        </PageWrapper>
                    </MarginWidthWrapper>
                </main>
            </div>    
        </>
    );
}

import React from "react";
import Header from "@/components/sidebar/header";
import HeaderMobile from "@/components/sidebar/header-mobile";
import SideNav from "@/components/sidebar/side-nav";
import PageWrapper from "@/components/sidebar/page-wrapper";
import MarginWidthWrapper from "@/components/sidebar/margin-width-wrapper";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/UserContext";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>   
            <UserProvider>
                <div className="flex">
                    <SideNav />
                    <main className="flex-1">
                        <MarginWidthWrapper>
                            <Header/>
                            <HeaderMobile/>
                            <PageWrapper>{children}
                            </PageWrapper>
                        </MarginWidthWrapper>
                    </main>
                </div>    
            </UserProvider>
        </>
    );
}

    
    
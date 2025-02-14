import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import React from "react";

export default function Layout({
    children,
}: {
    children: Readonly<React.ReactNode>;
}) {
    return (
        <div>
            <Navbar />
            {children}
            <aside className="border-t px-4 py-8 lg:px-16 lg:py-16">
                <Footer />
            </aside>
        </div>
    );
}

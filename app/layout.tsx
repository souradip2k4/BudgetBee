import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const helvetica = localFont({
    src: [
        {
            path: "../public/fonts/helvetica-light.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../public/fonts/helvetica.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/helvetica-oblique.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../public/fonts/helvetica-bold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/helvetica-bold-oblique.ttf",
            weight: "600",
            style: "italic",
        },
    ],
});
export const metadata: Metadata = {
    title: "Budgetbee - Expense Tracker",
    description: "Simple but effective personal expense tracker.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="antialiased dark">
            <body className={cn(`${helvetica.className} dark`)}>
                <GoogleAnalytics gaId={process.env.GA_ID as string} />
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}

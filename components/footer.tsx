import BudgetbeeLogo from "@/public/images/logo/wallet_16.svg";
import {
    IconBrandGithubFilled,
    IconBrandSlack,
    IconBrandX,
    IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type FooterBlock = { title: string; link: { name: string; href: string }[] };

const blocks: FooterBlock[] = [
    {
        title: "Company",
        link: [
            { name: "Community", href: "/community" },
            { name: "Contact Us", href: "/contact" },
            { name: "Report a bug", href: "/report-a-bug" },
        ],
    },
    {
        title: "Legal",
        link: [
            { name: "Privacy Policy", href: "/legal/privacy-policy" },
            { name: "Terms of Service", href: "/legal/terms-of-service" },
        ],
    },
    {
        title: "Developers",
        link: [
            { name: "API", href: "/api" },
            { name: "Status", href: "https://budgetbee.openstatus.dev" },
            { name: "GitHub", href: "https://github.com/budgetbee-org" },
            { name: "README", href: "/readme" },
        ],
    },
] as const;

export function Footer() {
    return (
        <div className="grid gap-8 text-sm lg:grid-cols-6 px-36">
            <div className="col-span-3 flex justify-between lg:flex-col">
                <div className="inline-flex items-center gap-1">
                    <img
                        alt="Budgetbee logo"
                        src={BudgetbeeLogo.src}
                        className="h-6 w-6"
                    />
                    <p className="text-[#A3A3A3]">Budgetbee</p>
                </div>
                <div className="inline-flex gap-4 text-[#A3A3A3] [&>*]:h-4 [&>*]:w-4">
                    <IconBrandGithubFilled />
                    <IconBrandYoutubeFilled />
                    <IconBrandX />
                    <IconBrandSlack />
                </div>
            </div>
            {blocks.map((item: any, index: number) => {
                return (
                    <React.Fragment key={`fbl-${index}`}>
                        <div className="flex flex-col gap-4">
                            <h3 className="">{item.title}</h3>
                            {item.link.map((link: any, index: number) => (
                                <footer key={`flnk-${index}`}>
                                    <Link
                                        className="text-[#A3A3A3]"
                                        key={`fl-${index}`}
                                        href={link.href}>
                                        {link.name}
                                    </Link>
                                </footer>
                            ))}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

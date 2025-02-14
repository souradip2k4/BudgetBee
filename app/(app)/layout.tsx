import { SidebarLayout } from "@/components/sidebar";
import React from "react";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<React.Fragment>
			<SidebarLayout>{children}</SidebarLayout>
		</React.Fragment>
	);
}

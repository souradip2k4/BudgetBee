import React from "react";

export default function LayoutAuth({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-full min-h-screen w-full items-center justify-center">
			{children}
		</div>
	);
}

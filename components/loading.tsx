import React from "react";

export function Loading({
	isLoading,
	fallback,
	children,
}: {
	isLoading: boolean;
	fallback: String | React.ReactNode;
	children: React.ReactNode;
}) {
	if (isLoading === false) {
		return children;
	}
	return fallback;
}
